package main

import (
	"github.com/gin-gonic/gin"
	"k-note/internal/file"
)

type application struct {
	router *gin.Engine
	toc []*file.Category
	fileIndex  map[string]*file.NoteFile
}

func NewApplication() *application {
	app := &application{
		router: gin.Default(),
		toc:    []*file.Category{},
		fileIndex: make(map[string]*file.NoteFile),
	}

	app.setupRoutes()
	return app
}

func (app *application) Run(addr string) error {
	return app.router.Run(addr)
}
