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

func InitOperationsRoutes(r martini.Router) {
	r.Group("/admin/operations", func(router martini.Router) {
		router.Get("/get/:id", getOperation)
		router.Get("/list", getOperations)
		router.Get("/application/:appId", getOperationsByApplication)
		router.Post("/create", createOperations)
		router.Post("/update", updateOperations)
		router.Post("/delete/:id", deleteOperation)
	})
}

func getOperation(enc Encoder, r *http.Request, m martini.Params) (int, string) {
	ret := model.Operation_ByPk(m["id"])
	if v, err := strconv.Atoi(m["id"]); err != nil || ret.Id != v {
		return Result(enc, http.StatusNotFound, "Operation not found.")
	}

	return Result(enc, http.StatusOK, ret)
}

func getOperations(enc Encoder, r *http.Request) (int, string) {
	ret := model.Operation_List()
	return Result(enc, http.StatusOK, ret)
}

func getOperationsByApplication(enc Encoder, r *http.Request, m martini.Params) (int, string) {
	ret := model.Operation_ListByAppId(m["appId"])
	return Result(enc, http.StatusOK, ret)
}

func createOperations(enc Encoder, r *http.Request) (int, string) {
	oper := model.Operation{}
	err := json.NewDecoder(r.Body).Decode(&oper)
	if err != nil {
		log.Println("Unable to decode as model.Operation:", err)
	}

	if strings.TrimSpace(oper.Code) == "" {
		return Result(enc, http.StatusBadRequest, "Parameter 'code' is required")
	}

	if strings.TrimSpace(oper.Description) == "" {
		return Result(enc, http.StatusBadRequest, "Parameter 'description' is required")
	}

	err = model.Operation_Create(&oper)

	if err != nil {
		log.Println(err)
		return Result(enc, http.StatusInternalServerError, fmt.Sprintf("Error creating Operation [%v]", err))
	}
	return Result(enc, http.StatusCreated, "Operation created succesfully")

}

func updateOperations(enc Encoder, r *http.Request) (int, string) {
	oper := model.Operation{}
	err := json.NewDecoder(r.Body).Decode(&oper)
	if err != nil {
		fmtError := fmt.Sprintf("Unable to decode as model.Operation: [%v]", err)
		log.Println(fmtError)
		return Result(enc, http.StatusInternalServerError, fmtError)
	}

	if strings.TrimSpace(oper.Code) == "" {
		return Result(enc, http.StatusBadRequest, "Parameter 'code' is required")
	}

	if strings.TrimSpace(oper.Description) == "" {
		return Result(enc, http.StatusBadRequest, "Parameter 'description' is required")
	}

	err = model.Operation_Update(&oper)

	if err != nil {
		log.Println(err)
		return Result(enc, http.StatusInternalServerError, fmt.Sprintf("Error Updating Operation [%v]", err))
	}
	return Result(enc, http.StatusOK, oper /*"Operation updated succesfully"*/)
}

func deleteOperation(enc Encoder, r *http.Request, m martini.Params) (int, string) {
	if id, err := strconv.Atoi(m["id"]); err != nil {
		log.Println(err)
		return Result(enc, http.StatusBadRequest, "Operation id not valid")
	} else {
		err = model.Operation_Delete(id)
		if err != nil {
			log.Println(err)
			return Result(enc, http.StatusInternalServerError, fmt.Sprintf("Error deleting Operation [%v]", err))
		}
		return Result(enc, http.StatusOK, "Operation deleted succesfully")
	}
}
