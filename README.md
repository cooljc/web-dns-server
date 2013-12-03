web-dns-server
==============

Simple DNS server with a web frontend - written in Node.js

Running
=======
```
$ npm install
# node index.js
```
or
```
$ sudo node index.js
```

Testing
=======
First add some records to the database using the web interface:
http://localhost:3000

Try some domain name lookups form the command line:

```
$ dig www.google.com @127.0.0.1

$ dig <your domain> @127.0.0.1
```
