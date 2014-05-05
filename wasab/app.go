package wasab

import (
	"github.com/go-martini/martini"
	"github.com/jcgarciam/go-wasab/wasab/web"
)

func RegisterRoutes(r martini.Router) {
	web.InitApplicationsRoutes(r)
	web.InitGroupsRoutes(r)
	web.InitOperationsRoutes(r)
	web.InitRolesRoutes(r)
}
