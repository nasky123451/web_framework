package config

import (
	"context"
	"log"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/gorilla/websocket"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/sirupsen/logrus"
)

var (
	RedisClient *redis.Client
	PgConn      *pgxpool.Pool
	Ctx         = context.Background()
	Upgrader    = websocket.Upgrader{CheckOrigin: func(r *http.Request) bool { return true }}
	Clients     = make(map[*websocket.Conn]string)
	SessionTTL  = 10 * time.Minute
	Mu          sync.Mutex
	Logger      = logrus.New()
	AuthKey     = "YOUR_GENERATED_AUTH_KEY"
	SecretKey   = "YOUR_GENERATED_SECRET_KEY"
	Log         *logrus.Logger
)

func Init() {
	var err error
	// 初始化 Redis 客戶端
	RedisClient, err = InitRedis()
	if err != nil {
		log.Fatalf("Failed to initialize Redis client: %v", err)
	}

	// 初始化 PostgreSQL
	PgConn, err = InitDB()
	if err != nil {
		log.Fatalf("Failed to initialize PostgreSQL connection: %v", err)
	}

	// 日誌配置
	Logger.SetFormatter(&logrus.JSONFormatter{})
	file, err := os.OpenFile("app.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err == nil {
		Logger.Out = file
	} else {
		log.Fatal("Failed to log to file, using default stderr")
	}
}
