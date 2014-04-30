package model

import (
	"database/sql"
	"github.com/coopernurse/gorp"
	_ "github.com/lib/pq"
	"log"
	"strings"
)

type NullString struct {
	sql.NullString
}

func (s *NullString) MarshalJSON() ([]byte, error) {
	if s.Valid {
		return []byte(`"` + s.String + `"`), nil
	}
	return []byte(`""`), nil
}

func (s *NullString) UnmarshalJSON(data []byte) error {
	s.String = strings.Trim(string(data), `"`)
	s.Valid = true
	return nil
}

type Application struct {
	Id       int    `json:"id" db:"id"`
	Name     string `json:"name" db:"name"`
	PublicId string `json:"public_id" db:"public_id"`
	Enabled  bool   `json:"enabled" db:"enabled"`
}

type Group struct {
	Id            int    `json:"id" db:"id"`
	Name          string `json:"name" db:"name"`
	ApplicationId int    `json:"application_id" db:"application_id"`
}

type GroupApplicationJoin struct {
	Group
	ApplicationName string `json:"application_name" db:"application_name"`
}

type Operation struct {
	Id            int    `json:"id" db:"id"`
	ApplicationId int    `json:"application_id" db:"application_id"`
	Code          string `json:"code" db:"code"`
	Description   string `json:"description" db:"description"`
}
type OperationApplicationJoin struct {
	Operation
	ApplicationName string `json:"application_name" db:"application_name"`
}

type GroupOperation struct {
	GroupId     int `json:"group_id" db:"group_id"`
	OperationId int `json:"operaton_id" db:"operaton_id"`
}

type Role struct {
	Id      int    `json:"id" db:"id"`
	Name    string `json:"name" db:"name"`
	Enabled bool   `json:"enabled" db:"enabled"`
}

type RoleGroup struct {
	Role  int `json:"role_id" db:"role_id"`
	Group int `json:"group_id" db:"group_id"`
}

type User struct {
	Id      int    `json:"id" db:"id"`
	Name    string `json:"name" db:"name"`
	ExtCode string `json:"ext_code" db:"ext_code"`
	Enabled bool   `json:"enabled" db:"enabled"`
}

type UserRole struct {
	User int `json:"user_id" db:"user_id"`
	Role int `json:"role_id" db:"role_id"`
}

var (
	dbMap *gorp.DbMap
)

func init() {
	log.Println("Initializing DatabaseStore")
	//TODO::READ THIS FROM CONFIG FILE
	db, err := sql.Open("postgres", "user=dev password=dev host=localhost port=5432 dbname=wasab sslmode=disable") //
	checkErr(err, "sql.Open failed")

	// construct a gorp DbMap
	dbMap = &gorp.DbMap{Db: db, Dialect: gorp.PostgresDialect{}}

	//
	dbMap.AddTableWithName(Application{}, "applications").SetKeys(true, "Id")
	dbMap.AddTableWithName(Group{}, "groups").SetKeys(true, "Id")
	dbMap.AddTableWithName(Operation{}, "operations").SetKeys(true, "Id")
	dbMap.AddTableWithName(Role{}, "roles").SetKeys(true, "Id")
	dbMap.AddTableWithName(RoleGroup{}, "roles_group")
	dbMap.AddTableWithName(User{}, "users").SetKeys(true, "Id")
	dbMap.AddTableWithName(UserRole{}, "users_roles")

}

func checkErr(err error, msg string) {
	if err != nil {
		log.Println(msg, err)
	}
}

///ByPk
func Application_ByPk(id string) Application {
	var apps Application

	err := dbMap.SelectOne(&apps, "select * from applications where id = $1", id)
	checkErr(err, "sql.QueryByPk Applications")

	return apps
}
func Group_ByPk(id string) GroupApplicationJoin {
	var ret GroupApplicationJoin
	sql := `select groups.*, applications.name application_name 
			from groups, applications
		  	where groups.application_id = applications.id and groups.id = $1`

	err := dbMap.SelectOne(&ret, sql, id)
	checkErr(err, "sql.QueryByPk Groups")

	return ret
}
func Operation_ByPk(id string) OperationApplicationJoin {
	var ret OperationApplicationJoin

	sql := `select operations.*, applications.name application_name 
			from groups, operations
		  	where operations.application_id = applications.id and operations.id = $1`

	err := dbMap.SelectOne(&ret, sql, id)
	checkErr(err, "sql.QueryByPk Operation")

	return ret
}
func Role_ByPk(id string) Role {
	var ret Role

	err := dbMap.SelectOne(&ret, "select * from roles where id = $1", id)
	checkErr(err, "sql.QueryByPk Role")

	return ret
}
func User_ByPk(id string) User {
	var ret User

	err := dbMap.SelectOne(&ret, "select * from users where id = $1", id)
	checkErr(err, "sql.QueryByPk User")

	return ret
}

//List
func Application_List() []Application {
	var apps []Application

	_, err := dbMap.Select(&apps, "select * from applications order by id")
	checkErr(err, "sql.Query Applications")

	return apps
}
func Group_List() []Group {
	var apps []Group

	_, err := dbMap.Select(&apps, "select * from groups order by id")
	checkErr(err, "sql.Query Group")

	return apps
}
func Group_ListByAppId(appId string) []Group {
	var apps []Group

	_, err := dbMap.Select(&apps, "select * from groups where application_id = $1 order by id", appId)
	checkErr(err, "sql.Query Group by appId")

	return apps
}
func Operation_List() []Operation {
	var apps []Operation

	_, err := dbMap.Select(&apps, "select * from operations order by id")
	checkErr(err, "sql.Query Operation")

	return apps
}
func Operation_ListByAppId(appId string) []Operation {
	var apps []Operation

	_, err := dbMap.Select(&apps, "select * from operations where application_id = $1 order by id", appId)
	checkErr(err, "sql.Query operation by appId")

	return apps
}
func Role_List() []Role {
	var apps []Role

	_, err := dbMap.Select(&apps, "select * from roles order by id")
	checkErr(err, "sql.Query Role")

	return apps
}
func User_List() []User {
	var apps []User

	_, err := dbMap.Select(&apps, "select * from users order by id")
	checkErr(err, "sql.Query User")

	return apps
}

//Create
func Application_Create(app *Application) error {
	_, err := dbMap.Exec("insert into applications (name, enabled) values($1,$2)",
		strings.ToUpper(app.Name), app.Enabled)

	checkErr(err, "sql.Create Applications")
	return err
}
func Group_Create(grp *Group) error {
	_, err := dbMap.Exec("insert into groups (name, application_id) values($1,$2)",
		strings.ToUpper(grp.Name), grp.ApplicationId)

	checkErr(err, "sql.Create Group")
	return err
}
func Operation_Create(oper *Operation) error {
	_, err := dbMap.Exec("insert into operations (group_id, application_id, code, description) values($1,$2,$3)",
		oper.ApplicationId, strings.ToUpper(oper.Code), strings.ToUpper(oper.Description))

	checkErr(err, "sql.Create Operation")
	return err
}
func Role_Create(rol *Role) error {
	_, err := dbMap.Exec("insert into roles (name, enabled) values($1,$2)",
		strings.ToUpper(rol.Name), rol.Enabled)

	checkErr(err, "sql.Create Role")
	return err
}
func User_Create(usr *User) error {
	_, err := dbMap.Exec("insert into users (name, ext_code, enabled) values($1,$2,$3)",
		strings.ToUpper(usr.Name), strings.ToUpper(usr.ExtCode), usr.Enabled)

	checkErr(err, "sql.Create Applications")
	return err
}

///Update
func Application_Update(app *Application) error {
	_, err := dbMap.Exec("update  applications set name = $2 where id = $1",
		app.Id, strings.ToUpper(app.Name))

	checkErr(err, "sql.Update Applications")
	return err
}
func Group_Update(grp *Group) error {
	_, err := dbMap.Exec("update  groups set name = $2, application_id = $3 where id = $1",
		grp.Id, strings.ToUpper(grp.Name), grp.ApplicationId)

	checkErr(err, "sql.Update Group")
	return err
}
func Operation_Update(ope *Operation) error {
	_, err := dbMap.Exec("update  operations set application_id = $2, code = $3, description = $4 where id = $1",
		ope.Id, ope.ApplicationId, strings.ToUpper(ope.Code), strings.ToUpper(ope.Description))

	checkErr(err, "sql.Update Operation")
	return err
}
func Role_Update(rol *Role) error {
	_, err := dbMap.Exec("update  roles set name = $2 where id = $1",
		rol.Id, strings.ToUpper(rol.Name))

	checkErr(err, "sql.Update Role")
	return err
}
func User_Update(app *User) error {
	_, err := dbMap.Exec("update  users set name = $2, ext_code = $3 where id = $1",
		app.Id, strings.ToUpper(app.Name), app.ExtCode)

	checkErr(err, "sql.Update User")
	return err
}

///Delete
func Application_Delete(id int) error {
	app := Application{}
	err := dbMap.SelectOne(&app, "select id from applications where id = $1", id)
	if err == nil {
		_, err = dbMap.Delete(&app)
		if err == nil {
			return nil
		}
		checkErr(err, "sql.Delete Application")
	}

	return err
}
func Group_Delete(id int) error {
	app := Group{}
	err := dbMap.SelectOne(&app, "select id from groups where id = $1", id)
	if err == nil {
		_, err = dbMap.Delete(&app)
		if err == nil {
			return nil
		}
		checkErr(err, "sql.Delete Group")
	}

	return err
}
func Operation_Delete(id int) error {
	app := Operation{}
	err := dbMap.SelectOne(&app, "select id from operations where id = $1", id)
	if err == nil {
		_, err = dbMap.Delete(&app)
		if err == nil {
			return nil
		}
		checkErr(err, "sql.Delete Operation")
	}

	return err
}
func Role_Delete(id int) error {
	app := Role{}
	err := dbMap.SelectOne(&app, "select id from roles where id = $1", id)
	if err == nil {
		_, err = dbMap.Delete(&app)
		if err == nil {
			return nil
		}
		checkErr(err, "sql.Delete Role")
	}

	return err
}
func User_Delete(id int) error {
	app := Role{}
	err := dbMap.SelectOne(&app, "select id from users where id = $1", id)
	if err == nil {
		_, err = dbMap.Delete(&app)
		if err == nil {
			return nil
		}
		checkErr(err, "sql.Delete User")
	}

	return err
}
