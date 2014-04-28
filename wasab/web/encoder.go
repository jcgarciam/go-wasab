package web

import (
	"encoding/json"
	"github.com/go-martini/martini"
	"log"
	"net/http"
	"regexp"
	"strings"
)

// An Encoder implements an encoding format of values to be sent as response to
// requests on the API endpoints.
type Encoder interface {
	Encode(v interface{}) (string, error)
}

// The regex to check for the requested format (allows an optional trailing
// slash).
var rxExt = regexp.MustCompile(`(\.(?:xml|text|json))\/?$`)

// MapEncoder intercepts the request's URL, detects the requested format,
// and injects the correct encoder dependency for this request. It rewrites
// the URL to remove the format extension, so that routes can be defined
// without it.
func MapEncoder(c martini.Context, w http.ResponseWriter, r *http.Request) {
	// Get the format extension
	matches := rxExt.FindStringSubmatch(r.URL.Path)
	ft := ".json"
	if len(matches) > 1 {
		// Rewrite the URL without the format extension
		l := len(r.URL.Path) - len(matches[1])
		if strings.HasSuffix(r.URL.Path, "/") {
			l--
		}
		r.URL.Path = r.URL.Path[:l]
		ft = matches[1]
	}

	log.Println(r.URL.Path)

	// Inject the requested encoder
	switch ft {
	case ".xml":
		//c.MapTo(&xmlEncoder{}, (*Encoder)(nil))
		w.Header().Set("Content-Type", "application/xml")
	case ".text":
		//c.MapTo(&textEncoder{}, (*Encoder)(nil))
		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	default:
		c.MapTo(&jsonEncoder{}, (*Encoder)(nil))
		w.Header().Set("Content-Type", "application/json")
	}
}

type jsonEncoder struct {
}
type xmlEncoder struct {
}
type textEncoder struct {
}

func (enc *jsonEncoder) Encode(v interface{}) (string, error) {
	b, err := json.Marshal(v)
	return string(b), err
}

func Result(enc Encoder, httpCode int, value interface{}) (int, string) {
	str, err := enc.Encode(value)
	if err != nil {
		log.Fatal("Error returning result", err)
	}
	return httpCode, str
}
