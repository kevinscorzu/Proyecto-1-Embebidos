#ifndef __SERVER_H
#define __SERVER_H

#include <ulfius.h>
#include <jansson.h>
#include <string.h>
#include <stdio.h>
#include <stdlib.h>

pthread_mutex_t lock;

int startServer();

#endif