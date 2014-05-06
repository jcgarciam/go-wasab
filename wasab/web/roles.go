package web

import (
	"encoding/json"
	"fmt"
	"github.com/go-martini/martini"
	"github.com/jcgarciam/go-wasab/wasab/model"
	"log"
	"net/http"
	"strconv"
	"strings"
)

func InitRolesRoutes(r martini.Router) {
	r.Group("/admin/roles", func(router martini.Router) {
		router.Get("/get/:id", getRole)
		router.Get("/list", getRoles)
		router.Get("/application/:appId", getRolesByApplication)
		router.Post("/create", createRoles)
		router.Post("/update", updateRoles)
		router.Post("/delete/:id", deleteRole)
	})
}

func getRole(enc Encoder, r *http.Request, m martini.Params) (int, string) {
	ret := model.Role_ByPk(m["id"])
	if v, err := strconv.Atoi(m["id"]); err != nil || ret.Id != v {
		return Result(enc, http.StatusNotFound, "Role not found.")
	}

	return Result(enc, http.StatusOK, ret)
}

func getRoles(enc Encoder, r *http.Request) (int, string) {
	ret := model.Role_List()
	return Result(enc, http.StatusOK, ret)
}

func getRolesByApplication(enc Encoder, r *http.Request, m martini.Params) (int, string) {
	ret := model.Role_ListByAppId(m["appId"])
	return Result(enc, http.StatusOK, ret)
}
func createRoles(enc Encoder, r *http.Request) (int, string) {
	grp := model.Role{}
	err := json.NewDecoder(r.Body).Decode(&grp)
	if err != nil {
		log.Println("Unable to decode as model.Role:", err)
	}

	if strings.TrimSpace(grp.Name) == "" {
		return Result(enc, http.StatusBadRequest, "Parameter 'name' is required")
	}

	grp.Enabled = true
	err = model.Role_Create(&grp)

	if err != nil {
		log.Println(err)
		return Result(enc, http.StatusInternalServerError, fmt.Sprintf("Error creating Role [%v]", err))
	}
	return Result(enc, http.StatusCreated, "Role created succesfully")

}

func updateRoles(enc Encoder, r *http.Request) (int, string) {
	grp := model.Role{}
	err := json.NewDecoder(r.Body).Decode(&grp)
	if err != nil {
		fmtError := fmt.Sprintf("Unable to decode as model.Role: [%v]", err)
		log.Println(fmtError)
		return Result(enc, http.StatusInternalServerError, fmtError)
	}

	if strings.TrimSpace(grp.Name) == "" {
		return Result(enc, http.StatusBadRequest, "Parameter 'name' is required")
	}

	err = model.Role_Update(&grp)

	if err != nil {
		log.Println(err)
		return Result(enc, http.StatusInternalServerError, fmt.Sprintf("Error Updating Role [%v]", err))
	}
	return Result(enc, http.StatusOK, "Role updated succesfully")
}

func deleteRole(enc Encoder, r *http.Request, m martini.Params) (int, string) {
	if id, err := strconv.Atoi(m["id"]); err != nil {
		log.Println(err)
		return Result(enc, http.StatusBadRequest, "Role id not valid")
	} else {
		err = model.Role_Delete(id)
		if err != nil {
			log.Println(err)
			return Result(enc, http.StatusInternalServerError, fmt.Sprintf("Error deleting Role [%v]", err))
		}
		return Result(enc, http.StatusOK, "Role deleted succesfully")
	}
}
