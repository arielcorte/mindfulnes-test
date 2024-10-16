package main

import (
	"fmt"
	"net/http"
)

func serveIndex(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "public/index.html")
}

func main() {
	http.HandleFunc("/", serveIndex)
	http.Handle("/public/", http.StripPrefix("/public/", http.FileServer(http.Dir("public"))))
	fmt.Println("Listening in http://localhost:1717")
	http.ListenAndServe(":1717", nil)
}
