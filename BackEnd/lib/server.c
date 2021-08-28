#include "../include/server.h"

int allowCORS(const struct _u_request *request, struct _u_response *response, void *user_data);
int receiveLEDS(const struct _u_request *request, struct _u_response *response, void *user_data);
int getHouseState(const struct _u_request *request, struct _u_response *response, void *user_data);
int getPicture(const struct _u_request *request, struct _u_response *response, void *user_data);

int port = 8080;

int led0 = 0;
int led1 = 0;
int led2 = 0;
int led3 = 0;
int led4 = 0;

int door0 = 0;
int door1 = 0;
int door2 = 0;
int door3 = 0;

/**
 * Function that starts the server
 */
int startServer() {

    if (pthread_mutex_init(&lock, NULL) != 0) {
        printf("Failed to initialize mutex");
        return 1;
    }

    struct _u_instance instance;

    if (ulfius_init_instance(&instance, port, NULL, NULL) != U_OK) {
        printf("Error ulfius_init_instance, abort");
        return 1;
    }

    ulfius_add_endpoint_by_val(&instance, "OPTIONS", NULL, "*", 0, &allowCORS, NULL);
    ulfius_add_endpoint_by_val(&instance, "POST", "/Api/Leds", NULL, 0, &receiveLEDS, NULL);
    ulfius_add_endpoint_by_val(&instance, "GET", "/Api/House", NULL, 0, &getHouseState, NULL);
    ulfius_add_endpoint_by_val(&instance, "GET", "/Api/Camera", NULL, 0, &getPicture, NULL);

    if (ulfius_start_framework(&instance) == U_OK) {
        printf("Start server on port: %d\n", instance.port);
        pause();
    } else {
        printf("Error starting server");
    }

    printf("Server ended\n");

    ulfius_stop_framework(&instance);
    ulfius_clean_instance(&instance);

    pthread_mutex_destroy(&lock);

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
        printf("Error in the JSON received");
    } else {
        int led;
        for (int i = 0; i < json_array_size(receivedJson); i++) {
            json_t *data = json_array_get(receivedJson, i);
            led = json_integer_value(data);

            pthread_mutex_lock(&lock);

            switch (led) {
                case 0:
                    led0 = !led0;
                    //Poner aqui llamada a gpio
                    printf("Se ha cambiado el estado del LED %d a %d\n", led, led0);
                    break;
                case 1:
                    led1 = !led1;
                    //Poner aqui llamada a gpio
                    printf("Se ha cambiado el estado del LED %d a %d\n", led, led1);
                    break;
                case 2:
                    led2 = !led2;
                    //Poner aqui llamada a gpio
                    printf("Se ha cambiado el estado del LED %d a %d\n", led, led2);
                    break;
                case 3:
                    led3 = !led3;
                    //Poner aqui llamada a gpio
                    printf("Se ha cambiado el estado del LED %d a %d\n", led, led3);
                    break;
                case 4:
                    led4 = !led4;
                    //Poner aqui llamada a gpio
                    printf("Se ha cambiado el estado del LED %d a %d\n", led, led4);
                    break;
            }

            pthread_mutex_unlock(&lock);

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

    pthread_mutex_lock(&lock);

    json_object_set_new(houseJson, "led0", json_integer(led0));
    json_object_set_new(houseJson, "led1", json_integer(led1));
    json_object_set_new(houseJson, "led2", json_integer(led2));
    json_object_set_new(houseJson, "led3", json_integer(led3));
    json_object_set_new(houseJson, "led4", json_integer(led4));

    json_object_set_new(houseJson, "door0", json_integer(door0));
    json_object_set_new(houseJson, "door1", json_integer(door1));
    json_object_set_new(houseJson, "door2", json_integer(door2));
    json_object_set_new(houseJson, "door3", json_integer(door3));

    pthread_mutex_unlock(&lock);

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
    ulfius_set_string_body_response(response, 200, "Ok");
    return U_CALLBACK_CONTINUE;
}