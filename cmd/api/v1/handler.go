package main

import (
	"fmt"
	"k-note/internal/file"
	"k-note/internal/markdown"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func (app *application) loginHandler(c *gin.Context) {
	type loginRequest struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	var req loginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		app.invalidRequestResponse(c)
		return
	}
	// 1.查询数据库对比
	// 2.生成 JWT token
	// 3.返回结果 c.JSON(200, gin.H{"message": "login successful"})
	c.JSON(200, gin.H{"message": "login successful"})
}


func (app *application) categoriesHandler(c *gin.Context) {
	c.JSON(200, gin.H{"toc": app.toc})
}

func (app *application) showFileHandler(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		app.invalidRequestResponse(c)
		return
	}

	fileData, ok := app.fileIndex[id]
	if !ok {
		app.fileNotFoundResponse(c, id)
		return
	}
	fmt.Println(fileData.Path)
	absPath := filepath.Join("data", fileData.Path)
	mkBytes, err := file.ReadFile(absPath)
	if err != nil {
		app.fileNotFoundResponse(c, id)
		return
	}

	mc := markdown.NewMarkdownConverter()
	htmlContent, err := mc.MdToHtml(mkBytes)
	if err != nil {
		app.serverErrorResponse(c)
		return
	}
	c.JSON(200, gin.H{"id":id, "name": fileData.Name, "html": string(htmlContent)})
}

// 更新目录结构（重新扫描 data 目录）
func (app *application) updateCategoriesHandler(c *gin.Context) {
	toc,index, err := file.BuildCategoriesAndIndex("data")
	if err != nil {
		app.serverErrorResponse(c)
		return
	}
	app.toc = toc
	app.fileIndex = index
	c.JSON(200, gin.H{"toc": app.toc})
}