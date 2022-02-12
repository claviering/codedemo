package main

import (
	"encoding/json"
	"fmt"
	"time"
)

type Person struct {
	Name string
	Age  int
}

type Teacher struct {
	Person
	Title string
}

func main() {
	t := Teacher{
		Person: Person{
			Name: "John",
			Age:  30,
		},
		Title: "Mr.",
	}

	mapB, _ := json.Marshal(t)
	fmt.Println(string(mapB))
	// get timestamp in milliseconds
	timestamp := time.Now().UnixNano() / int64(time.Millisecond)
	fmt.Printf("%d \n", timestamp)
}
