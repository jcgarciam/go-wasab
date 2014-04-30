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

func InitGroupsRoutes(r martini.Router) {
	r.Group("/admin/groups", func(router martini.Router) {
		router.Get("/get/:id", getGroup)
		router.Get("/list", getGroups)
		router.Get("/application/:appId", getGroupsByApplication)
		router.Post("/create", createGroups)
		router.Post("/update", updateGroups)
		router.Post("/delete/:id", deleteGroup)
	})
}

func getGroup(enc Encoder, r *http.Request, m martini.Params) (int, string) {
	ret := model.Group_ByPk(m["id"])
	if v, err := strconv.Atoi(m["id"]); err != nil || ret.Id != v {
		return Result(enc, http.StatusNotFound, "Group not found.")
	}

	return Result(enc, http.StatusOK, ret)
}

func getGroups(enc Encoder, r *http.Request) (int, string) {
	ret := model.Group_List()
	return Result(enc, http.StatusOK, ret)
}

func getGroupsByApplication(enc Encoder, r *http.Request, m martini.Params) (int, string) {
	ret := model.Group_ListByAppId(m["appId"])
	return Result(enc, http.StatusOK, ret)
}
func createGroups(enc Encoder, r *http.Request) (int, string) {
	grp := model.Group{}
	err := json.NewDecoder(r.Body).Decode(&grp)
	if err != nil {
		log.Println("Unable to decode as model.Group:", err)
	}

	if strings.TrimSpace(grp.Name) == "" {
		return Result(enc, http.StatusBadRequest, "Parameter 'name' is required")
	}

	err = model.Group_Create(&grp)

	if err != nil {
		log.Println(err)
		return Result(enc, http.StatusInternalServerError, fmt.Sprintf("Error creating Group [%v]", err))
	}
	return Result(enc, http.StatusCreated, "Group created succesfully")

}

func updateGroups(enc Encoder, r *http.Request) (int, string) {
	grp := model.Group{}
	err := json.NewDecoder(r.Body).Decode(&grp)
	if err != nil {
		fmtError := fmt.Sprintf("Unable to decode as model.Group: [%v]", err)
		log.Println(fmtError)
		return Result(enc, http.StatusInternalServerError, fmtError)
	}

	if strings.TrimSpace(grp.Name) == "" {
		return Result(enc, http.StatusBadRequest, "Parameter 'name' is required")
	}

	err = model.Group_Update(&grp)

	if err != nil {
		log.Println(err)
		return Result(enc, http.StatusInternalServerError, fmt.Sprintf("Error Updating Group [%v]", err))
	}
	return Result(enc, http.StatusOK, "Group updated succesfully")
}

func deleteGroup(enc Encoder, r *http.Request, m martini.Params) (int, string) {
	if id, err := strconv.Atoi(m["id"]); err != nil {
		log.Println(err)
		return Result(enc, http.StatusBadRequest, "Group id not valid")
	} else {
		err = model.Group_Delete(id)
		if err != nil {
			log.Println(err)
			return Result(enc, http.StatusInternalServerError, fmt.Sprintf("Error deleting Group [%v]", err))
		}
		return Result(enc, http.StatusOK, "Group deleted succesfully")
	}
}
