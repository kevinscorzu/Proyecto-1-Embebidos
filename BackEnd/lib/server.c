#include <config.h>

#include <gpio.h>

#include <ulfius.h>
#include <jansson.h>
#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <semaphore.h>
#include <fcntl.h>

int allowCORS(const struct _u_request *request, struct _u_response *response, void *user_data);
int receiveLEDS(const struct _u_request *request, struct _u_response *response, void *user_data);
int getHouseState(const struct _u_request *request, struct _u_response *response, void *user_data);
int getPicture(const struct _u_request *request, struct _u_response *response, void *user_data);
int stopServer(const struct _u_request *request, struct _u_response *response, void *user_data);
int enablePins();
int disablePins();
void *readDoors(void *args);
void readDoorAux();

pthread_t doorThread;
pthread_mutex_t houseLock;
pthread_mutex_t stopLock;
sem_t *semStop;

int port = 8080;

int led0State = 0;
int led1State = 0;
int led2State = 0;
int led3State = 0;
int led4State = 0;
int led5State = 0;

int led0GPIO = 10;
int led1GPIO = 9;
int led2GPIO = 11;
int led3GPIO = 5;
int led4GPIO = 6;
int led5GPIO = 13;

int door0State = 0;
int door1State = 0;
int door2State = 0;
int door3State = 0;
int door4State = 0;

int door0GPIO = 23;
int door1GPIO = 24;
int door2GPIO = 25;
int door3GPIO = 18;
int door4GPIO = 12;

int stopThread = 0;

/**
 * Function that starts the server
 */
int startServer() {

    enablePins();

    semStop = sem_open("semStop", O_CREAT, 0644, 0);

    if (semStop == SEM_FAILED) {
        printf("Failed to initialize semaphore\n");
        exit(1);
    }    

    if (pthread_mutex_init(&houseLock, NULL) != 0) {
        printf("Failed to initialize the house mutex\n");
        exit(1);
    }

    if (pthread_mutex_init(&stopLock, NULL) != 0) {
        printf("Failed to initialize the thread mutex\n");
        exit(1);
    }

    pthread_create(&doorThread, NULL, readDoors, NULL);
    pthread_detach(doorThread);

    struct _u_instance instance;

    if (ulfius_init_instance(&instance, port, NULL, NULL) != U_OK) {
        printf("Error ulfius_init_instance, abort\n");
        return 1;
    }

    ulfius_add_endpoint_by_val(&instance, "OPTIONS", NULL, "*", 0, &allowCORS, NULL);
    ulfius_add_endpoint_by_val(&instance, "POST", "/Api/Leds", NULL, 0, &receiveLEDS, NULL);
    ulfius_add_endpoint_by_val(&instance, "GET", "/Api/House", NULL, 0, &getHouseState, NULL);
    ulfius_add_endpoint_by_val(&instance, "GET", "/Api/Camera", NULL, 0, &getPicture, NULL);
    ulfius_add_endpoint_by_val(&instance, "GET", "/Api/Close", NULL, 0, &stopServer, NULL);

    if (ulfius_start_framework(&instance) == U_OK) {
        printf("Start server on port: %d\n", instance.port);

        if (sem_wait(semStop) < 0) {
            printf("Error while waiting for the stop semaphore\n");
            exit(1);
        }

        sleep(1);

    } else {
        printf("Error starting server\n");
    }

    printf("Server ended\n");

    ulfius_stop_framework(&instance);
    ulfius_clean_instance(&instance);

    pthread_mutex_destroy(&houseLock);
    pthread_mutex_destroy(&stopLock);

    if (sem_close(semStop) != 0) {
        printf("Error while closing the stop semaphore\n");
        exit(1);
    }

    if (sem_unlink("semStop") < 0) {
        printf("Error while unlinking the stop semaphore\n");
        exit(1);
    }

    disablePins();

    return 0;
}

/**
 * Function that handles CORS of the server
 */
int allowCORS(const struct _u_request *request, struct _u_response *response, void *user_data) {
    u_map_put(response->map_header, "Access-Control-Allow-Origin", "*");
    u_map_put(response->map_header, "Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    u_map_put(response->map_header, "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Bearer, Authorization");
    u_map_put(response->map_header, "Access-Control-Max-Age", "1800");
    return U_CALLBACK_COMPLETE;
}

/**
 * Function that receives the LEDS from the client
 */
int receiveLEDS(const struct _u_request *request, struct _u_response *response, void *user_data) {
    json_t *receivedJson = ulfius_get_json_body_request(request, NULL);

    if (!json_is_array(receivedJson)) {
        printf("Error in the JSON received\n");
    } else {
        int led;
        for (int i = 0; i < json_array_size(receivedJson); i++) {
            json_t *data = json_array_get(receivedJson, i);
            led = json_integer_value(data);

            pthread_mutex_lock(&houseLock);

            switch (led) {
                case 0:
                    led0State = !led0State;
                    digitalWrite(led0GPIO, led0State);
                    printf("LED %d value changed to %d\n", led, led0State);
                    break;
                case 1:
                    led1State = !led1State;
                    digitalWrite(led1GPIO, led1State);
                    printf("LED %d value changed to %d\n", led, led1State);
                    break;
                case 2:
                    led2State = !led2State;
                    digitalWrite(led2GPIO, led2State);
                    printf("LED %d value changed to %d\n", led, led2State);
                    break;
                case 3:
                    led3State = !led3State;
                    digitalWrite(led3GPIO, led3State);
                    printf("LED %d value changed to %d\n", led, led3State);
                    break;
                case 4:
                    led4State = !led4State;
                    digitalWrite(led4GPIO, led4State);
                    printf("LED %d value changed to %d\n", led, led4State);
                    break;
                case 5:
                    led5State = !led5State;
                    digitalWrite(led5GPIO, led5State);
                    printf("LED %d value changed to %d\n", led, led5State);
                    break;
            }

            pthread_mutex_unlock(&houseLock);

            json_decref(data);
        }
    }

    json_decref(receivedJson);
    ulfius_set_string_body_response(response, 200, "Ok");
    return U_CALLBACK_CONTINUE;
}

/**
 * Function that returns the leds and doors states
 */
int getHouseState(const struct _u_request *request, struct _u_response *response, void *user_data) {
    json_t *houseJson = json_object();

    pthread_mutex_lock(&houseLock);

    json_object_set_new(houseJson, "led0", json_integer(led0State));
    json_object_set_new(houseJson, "led1", json_integer(led1State));
    json_object_set_new(houseJson, "led2", json_integer(led2State));
    json_object_set_new(houseJson, "led3", json_integer(led3State));
    json_object_set_new(houseJson, "led4", json_integer(led4State));
    json_object_set_new(houseJson, "led5", json_integer(led5State));

    json_object_set_new(houseJson, "door0", json_integer(door0State));
    json_object_set_new(houseJson, "door1", json_integer(door1State));
    json_object_set_new(houseJson, "door2", json_integer(door2State));
    json_object_set_new(houseJson, "door3", json_integer(door3State));
    json_object_set_new(houseJson, "door4", json_integer(door4State));

    pthread_mutex_unlock(&houseLock);

    char *response_body = json_dumps(houseJson, JSON_ENCODE_ANY);

    ulfius_set_string_body_response(response, 200, response_body);

    json_decref(houseJson);
    free(response_body);

    return U_CALLBACK_CONTINUE;
}

/**
 * Function that takes a picture with the camera
 */
int getPicture(const struct _u_request *request, struct _u_response *response, void *user_data) {
    
    system("fswebcam image.jpg");

    system("base64 image.jpg > data.txt");

    FILE *base64Image = fopen("data.txt", "r");
    char line[121];
    char **readData = NULL;
    int lineLenght;
    int lineAmount = 0;
    unsigned long amountOfChars = 0;

    while (fgets(line, 120, base64Image)) {
        readData = realloc(readData, (lineAmount + 1) * sizeof(char*));
        line[strcspn(line, "\n")] = 0;
        lineLenght = strlen(line);
        readData[lineAmount] = calloc(sizeof(char), lineLenght + 1);
        strcpy(readData[lineAmount], line);
        lineAmount++;
        amountOfChars += lineLenght;
    }

    fclose(base64Image);

    char *fullString = malloc(amountOfChars + 1);
    strcpy(fullString, readData[0]);
    free(readData[0]);

    for (int i = 1; i < lineAmount; i++) {
        strcat(fullString, readData[i]);
        free(readData[i]);
    }

    free(readData);

    json_t *imageJson = json_object();

    json_object_set_new(imageJson, "image", json_string(fullString));

    free(fullString);

    char *response_body = json_dumps(imageJson, JSON_ENCODE_ANY);

    ulfius_set_string_body_response(response, 200, response_body);

    json_decref(imageJson);
    free(response_body);

    remove("image.jpg");
    remove("data.txt");

    return U_CALLBACK_CONTINUE;
}

/**
 * Function that stops the server
 */
int stopServer(const struct _u_request *request, struct _u_response *response, void *user_data) {
    printf("Closing server\n");
    ulfius_set_string_body_response(response, 200, "Ok");
    
    if (sem_post(semStop) < 0) {
        printf("Error while posting the stop semaphore\n");
        exit(1);
    }

    pthread_mutex_lock(&stopLock);

    stopThread = 1;

    pthread_mutex_unlock(&stopLock);

    return U_CALLBACK_CONTINUE;
}

/**
 * Function that initializes the pins of the Raspberry Pi
 */
int enablePins() {

    printf("Initializing pins\n");

    enablePin(led0GPIO);
    enablePin(led1GPIO);
    enablePin(led2GPIO);
    enablePin(led3GPIO);
    enablePin(led4GPIO);
    enablePin(led5GPIO);

    enablePin(door0GPIO);
    enablePin(door1GPIO);
    enablePin(door2GPIO);
    enablePin(door3GPIO);
    enablePin(door4GPIO);

    printf("Pins initialized successfully\n");

    printf("Configuring pins\n");

    pinMode(led0GPIO, "out");
    pinMode(led1GPIO, "out");
    pinMode(led2GPIO, "out");
    pinMode(led3GPIO, "out");
    pinMode(led4GPIO, "out");
    pinMode(led5GPIO, "out");

    pinMode(door0GPIO, "in");
    pinMode(door1GPIO, "in");
    pinMode(door2GPIO, "in");
    pinMode(door3GPIO, "in");
    pinMode(door4GPIO, "in");

    printf("Pins configured successfully\n");

    digitalWrite(led0GPIO, 0);
    digitalWrite(led1GPIO, 0);
    digitalWrite(led2GPIO, 0);
    digitalWrite(led3GPIO, 0);
    digitalWrite(led4GPIO, 0);
    digitalWrite(led5GPIO, 0);
    
    return 0;
}

/**
 * Function that disables the pins of the Raspberry Pi
 */
int disablePins() {

    printf("Disabling pins\n");

    disablePin(led0GPIO);
    disablePin(led1GPIO);
    disablePin(led2GPIO);
    disablePin(led3GPIO);
    disablePin(led4GPIO);
    disablePin(led5GPIO);

    disablePin(door0GPIO);
    disablePin(door1GPIO);
    disablePin(door2GPIO);
    disablePin(door3GPIO);
    disablePin(door4GPIO);

    printf("Pins disabled successfully\n");

    return 0;
}

void *readDoors(void *args) {
    int readValue = 0;

    while (1) {
        pthread_mutex_lock(&stopLock);

        if (stopThread == 1) {
            break;
        }

        pthread_mutex_unlock(&stopLock);

        pthread_mutex_lock(&houseLock);

        readValue = digitalRead(door0GPIO);

        if (readValue == 1) {
            door0State = !door0State;
            readDoorAux(door0GPIO);
        }

        readValue = digitalRead(door1GPIO);

        if (readValue == 1) {
            door1State = !door1State;
            readDoorAux(door1GPIO);
        }

        readValue = digitalRead(door2GPIO);

        if (readValue == 1) {
            door2State = !door2State;
            readDoorAux(door2GPIO);
        }

        readValue = digitalRead(door3GPIO);

        if (readValue == 1) {
            door3State = !door3State;
            readDoorAux(door3GPIO);
        }

        readValue = digitalRead(door4GPIO);

        if (readValue == 1) {
            door4State = !door4State;
            readDoorAux(door4GPIO);
        }

        pthread_mutex_unlock(&houseLock);

    }

    pthread_mutex_unlock(&stopLock);

    pthread_exit(NULL);
}

void readDoorAux(int doorGPIO) {

    int readValue = 0;

    while (1) {

        readValue = digitalRead(doorGPIO);

        if (readValue == 0) {
            break;
        }
        
    }

    return;
}