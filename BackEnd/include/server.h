#ifndef __SERVER_H
#define __SERVER_H

#include <ulfius.h>
#include <jansson.h>
#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <semaphore.h>
#include <fcntl.h>

pthread_t doorThread;
pthread_mutex_t houseLock;
pthread_mutex_t stopLock;
sem_t *semStop;

int startServer();

#endif