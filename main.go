package main

import (
	"web_framework/config"
	"web_framework/handlers"

	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize configurations, databases, and other services
	config.Init()

	r := gin.Default()

	// Setup routes
	handlers.SetupRoutes(r)

	// Start the server
	r.Run(":8080")
}
