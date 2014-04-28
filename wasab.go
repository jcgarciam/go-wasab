package main

import (
	"github.com/go-martini/martini"
	"github.com/jcgarciam/go-wasab/wasab"
	"github.com/jcgarciam/go-wasab/wasab/web"
)

var (
	m *martini.Martini
)

func main() {
	opt := martini.StaticOptions{}

	opt.SkipLogging = true

	r := martini.NewRouter()
	wasab.RegisterRoutes(r)

	m = martini.New()
	m.Use(martini.Logger())
	m.Use(martini.Recovery())
	m.Use(martini.Static("public", opt))
	m.Use(web.MapEncoder)

	m.MapTo(r, (*martini.Routes)(nil))
	m.Action(r.Handle)

	m.Run()
}
