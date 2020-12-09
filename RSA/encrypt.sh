openssl rsautl -in test.txt -inkey private.pem -encrypt
echo 'hello' | openssl rsautl -encrypt -inkey private.pem -hexdump -out tmp