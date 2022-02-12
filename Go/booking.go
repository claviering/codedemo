// 健康驿站房间网上预约
package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	"time"
)

var HTTPTransport = &http.Transport{
	DialContext: (&net.Dialer{
		Timeout:   30 * time.Second, // 连接超时时间
		KeepAlive: 60 * time.Second, // 保持长连接的时间
	}).DialContext, // 设置连接的参数
	MaxIdleConns:          500,              // 最大空闲连接
	IdleConnTimeout:       60 * time.Second, // 空闲连接的超时时间
	ExpectContinueTimeout: 30 * time.Second, // 等待服务第一个响应的超时时间
	MaxIdleConnsPerHost:   100,              // 每个host保持的空闲连接数
}

func getVerify() {
	resp, err := http.Get("https://hk.sz.gov.cn:8118/userPage/login")
	if err != nil {
		log.Fatal(err)
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(string(body))
}

func login(client http.Client) {
	for i := 0; i < 3; i++ {
		req, err := http.NewRequest(http.MethodGet, "http://127.0.0.1:8200/", nil)
		if err != nil {
			panic("Http Req Failed " + err.Error())
		}
		resp, err := client.Do(req)
		if err != nil {
			panic("Http Request Failed " + err.Error())
		}
		defer resp.Body.Close()
		buf, err := ioutil.ReadAll(resp.Body)
		fmt.Printf("%s\n", string(buf))
	}
}

func main() {
	// client := http.Client{
	// 	Transport: HTTPTransport,
	// }
	// login(client) // to be Hello world 1 views
	// login(client) // to be Hello world 2 views
	// login(client) // to be Hello world 3 views
	request, err := http.NewRequest("GET", "http://127.0.0.1:8200/", nil)
	if err != nil {
		log.Fatal(err)
	}

	http_client := &http.Client{}
	response, err := http_client.Do(request)
	if err != nil {
		log.Fatal(err)
	}

	buf := make([]byte, 4096) // any non zero value will do, try '1'.
	for {
		n, err := response.Body.Read(buf)
		if err != nil { // simplified
			log.Fatal(err)
			break
		}

		fmt.Printf("%s", buf[:n]) // no need to convert to string here
	}
}
