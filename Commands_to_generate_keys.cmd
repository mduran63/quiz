md certs
cd certs

C:\Users\mduran\OpenSSL\bin\openssl genrsa -out quiz-key.pem 2048
C:\Users\mduran\OpenSSL\bin\openssl req -new -sha256 -key quiz-key.pem -out quiz-csr.pem -config C:\Users\mduran\OpenSSL\share\openssl.cnf
C:\Users\mduran\OpenSSL\bin\openssl x509 -req -in quiz-csr.pem -signkey quiz-key.pem -out quiz-cert.pem
