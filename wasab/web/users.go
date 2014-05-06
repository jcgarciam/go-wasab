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

func InitUsersRoutes(r martini.Router) {
	r.Group("/admin/users", func(router martini.Router) {
		router.Get("/get/:id", getUser)
		router.Get("/list", getUsers)
		router.Post("/create", createUsers)
		router.Post("/update", updateUsers)
		//router.Post("/delete/:id", deleteUser)
	})
}

func getUser(enc Encoder, r *http.Request, m martini.Params) (int, string) {
	ret := model.User_ByPk(m["id"])
	if v, err := strconv.Atoi(m["id"]); err != nil || ret.Id != v {
		return Result(enc, http.StatusNotFound, "User not found.")
	}

	return Result(enc, http.StatusOK, ret)
}

func getUsers(enc Encoder, r *http.Request) (int, string) {
	ret := model.User_List()
	return Result(enc, http.StatusOK, ret)
}

func createUsers(enc Encoder, r *http.Request) (int, string) {
	grp := model.User{}
	err := json.NewDecoder(r.Body).Decode(&grp)
	if err != nil {
		log.Println("Unable to decode as model.User:", err)
	}

	if strings.TrimSpace(grp.Name) == "" {
		return Result(enc, http.StatusBadRequest, "Parameter 'name' is required")
	}

	grp.Enabled = true
	err = model.User_Create(&grp)

	if err != nil {
		log.Println(err)
		return Result(enc, http.StatusInternalServerError, fmt.Sprintf("Error creating User [%v]", err))
	}
	return Result(enc, http.StatusCreated, "User created succesfully")

}

func updateUsers(enc Encoder, r *http.Request) (int, string) {
	grp := model.User{}
	err := json.NewDecoder(r.Body).Decode(&grp)
	if err != nil {
		fmtError := fmt.Sprintf("Unable to decode as model.User: [%v]", err)
		log.Println(fmtError)
		return Result(enc, http.StatusInternalServerError, fmtError)
	}

	if strings.TrimSpace(grp.Name) == "" {
		return Result(enc, http.StatusBadRequest, "Parameter 'name' is required")
	}

	err = model.User_Update(&grp)

	if err != nil {
		log.Println(err)
		return Result(enc, http.StatusInternalServerError, fmt.Sprintf("Error Updating User [%v]", err))
	}
	return Result(enc, http.StatusOK, "User updated succesfully")
}

func deleteUser(enc Encoder, r *http.Request, m martini.Params) (int, string) {
	if id, err := strconv.Atoi(m["id"]); err != nil {
		log.Println(err)
		return Result(enc, http.StatusBadRequest, "User id not valid")
	} else {
		err = model.User_Delete(id)
		if err != nil {
			log.Println(err)
			return Result(enc, http.StatusInternalServerError, fmt.Sprintf("Error deleting User [%v]", err))
		}
		return Result(enc, http.StatusOK, "User deleted succesfully")
	}
}
