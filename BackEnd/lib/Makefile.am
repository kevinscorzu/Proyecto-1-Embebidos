lib_LTLIBRARIES = libinthouse.la
include_HEADERS = $(top_srcdir)/include/gpio.h $(top_srcdir)/include/server.h
AM_CPPFLAGS = -I$(top_srcdir)/include
libinthouse_la_SOURCES = gpio.c server.c
AM_LDFLAGS = -lpthread -lulfius -ljansson