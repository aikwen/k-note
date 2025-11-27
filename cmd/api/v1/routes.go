package main

import (
	"github.com/gin-contrib/cors"
)

func (app *application) setupRoutes() {
	app.router.Use(cors.Default())
	app.router.GET("/api/v1/healthcheck", healthcheckHandler)
	app.router.POST("/api/v1/login", app.loginHandler)

	app.router.GET("/api/v1/update", app.updateCategoriesHandler)

	authGroup := app.router.Group("/api/v1")
	authGroup.Use()
	{
		authGroup.GET("/categories", app.categoriesHandler)
		authGroup.GET("/file/:id", app.showFileHandler)
	}
}
