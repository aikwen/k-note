package main

import (
	"github.com/gin-gonic/gin"
)

func (app *application) errorResponse(c *gin.Context, status int, message interface{}) {
	env := gin.H{"error": message}

	c.JSON(status, env)
}

func (app *application) invalidRequestResponse(c *gin.Context) {
	app.errorResponse(c, 400, "Invalid request parameters")
}

func (app *application) serverErrorResponse(c *gin.Context) {
	app.errorResponse(c, 500, "The server encountered a problem and could not process your request")
}

func (app *application) fileNotFoundResponse(c *gin.Context, id string) {
	c.JSON(200, gin.H{"id": id, "name":"not found", "html":"未找到该文件"})
}