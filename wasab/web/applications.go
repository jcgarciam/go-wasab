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

func InitApplicationsRoutes(r martini.Router) {
	r.Group("/admin/applications", func(router martini.Router) {
		router.Get("/get/:id", getApplication)
		router.Get("/list", getApplications)
		router.Post("/create", createApplications)
		router.Post("/update", updateApplications)
		router.Post("/delete/:id", deleteApplication)
	})
}

func getApplication(enc Encoder, r *http.Request, m martini.Params) (int, string) {
	ret := model.Application_ByPk(m["id"])

	if v, err := strconv.Atoi(m["id"]); err != nil || ret.Id != v {
		return Result(enc, http.StatusNotFound, "Application not found.")
	}
	return Result(enc, http.StatusOK, ret)
}

func getApplications(enc Encoder, r *http.Request) (int, string) {
	ret := model.Application_List()
	return Result(enc, http.StatusOK, ret)
}

func createApplications(enc Encoder, r *http.Request) (int, string) {
	app := model.Application{}
	err := json.NewDecoder(r.Body).Decode(&app)
	if err != nil {
		log.Println("Unable to decode as model.application:", err)
	}

	if strings.TrimSpace(app.Name) == "" {
		return Result(enc, http.StatusBadRequest, "Parameter 'name' is required")
	}

	app.Enabled = true
	err = model.Application_Create(&app)

	if err != nil {
		log.Println(err)
		return Result(enc, http.StatusInternalServerError, fmt.Sprintf("Error creating application [%v]", err))
	}
	return Result(enc, http.StatusCreated, "Application created succesfully")

}

func updateApplications(enc Encoder, r *http.Request) (int, string) {
	app := model.Application{}
	err := json.NewDecoder(r.Body).Decode(&app)
	if err != nil {
		fmtError := fmt.Sprintf("Unable to decode as model.application: [%v]", err)
		log.Println(fmtError)
		return Result(enc, http.StatusInternalServerError, fmtError)
	}

	if strings.TrimSpace(app.Name) == "" {
		return Result(enc, http.StatusBadRequest, "Parameter 'name' is required")
	}

	err = model.Application_Update(&app)

	if err != nil {
		log.Println(err)
		return Result(enc, http.StatusInternalServerError, fmt.Sprintf("Error Updating application [%v]", err))
	}
	return Result(enc, http.StatusOK, app /*"Application updated succesfully"*/)
}

func deleteApplication(enc Encoder, r *http.Request, m martini.Params) (int, string) {
	if id, err := strconv.Atoi(m["id"]); err != nil {
		log.Println(err)
		return Result(enc, http.StatusBadRequest, "Application id not valid")
	} else {
		err = model.Application_Delete(id)
		if err != nil {
			log.Println(err)
			return Result(enc, http.StatusInternalServerError, fmt.Sprintf("Error deleting application [%v]", err))
		}
		return Result(enc, http.StatusOK, "Application deleted succesfully")
	}
}

func noop(w http.ResponseWriter, r *http.Request, m martini.Params) {

}
