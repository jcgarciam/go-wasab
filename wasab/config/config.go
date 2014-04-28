package config

var (
	Loader = &config{}
)

func init() {
	Loader.Database.host = "localhost"
	Loader.Database.port = 54321
	Loader.Database.user = "dev"
	Loader.Database.password = "postgres"
}

type config struct {
	Database dbParams
}
type dbParams struct {
	host     string
	port     int
	user     string
	password string
}

func (p *dbParams) Host() string {
	return p.host
}
func (p *dbParams) Port() int {
	return p.port
}
func (p *dbParams) User() string {
	return p.user
}
func (p *dbParams) Password() string {
	return p.password
}
