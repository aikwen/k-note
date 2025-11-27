package auth

import (
	"github.com/golang-jwt/jwt/v5"
	gonanoid "github.com/matoous/go-nanoid/v2"

	"time"
	"fmt"
	"math/rand"
    "strings"
)

const (
	Issuer = "k-note"
	AccessTokenAudienceName = "user.access-token"
	ExpirationDuration = 14 * 24 * time.Hour
)

type ClaimsMessage struct {
	Name string `json:"name"`
	jwt.RegisteredClaims
}

// generateToken 生成一个 JWT token.
func GenerateAccessToken(username string, userID int32, secret []byte) (string, error) {
	nowTime := time.Now()
	registeredClaims := jwt.RegisteredClaims{
		Issuer:   Issuer,
		Audience: jwt.ClaimStrings{AccessTokenAudienceName},
		IssuedAt: jwt.NewNumericDate(nowTime),
		Subject:  fmt.Sprint(userID),
	}

	registeredClaims.ExpiresAt = jwt.NewNumericDate(nowTime.Add(ExpirationDuration))

	// Declare the token with the HS256 algorithm used for signing, and the claims.
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, &ClaimsMessage{
		Name:             username,
		RegisteredClaims: registeredClaims,
	})

	// Create the JWT string.
	tokenString, err := token.SignedString(secret)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

// ParseAccessToken 解析并验证 JWT token.
func ParseAccessToken(tokenString string, secret []byte) (*ClaimsMessage, error) {
	claims := &ClaimsMessage{}
	_, err := jwt.ParseWithClaims(tokenString, claims, func(t *jwt.Token) (any, error) {
		if t.Method.Alg() != jwt.SigningMethodHS256.Name {
			return nil, fmt.Errorf("unexpected access token signing method=%v, expect %v", t.Header["alg"], jwt.SigningMethodHS256)
		}
		return secret, nil
	})

	if err != nil {
		return nil, fmt.Errorf("invalid or expired access token")
	}

	return claims, nil
}

func NewNodeID() string {
	id, err := gonanoid.New(10)
	if err != nil {
		return fallbackRandomString(10)
	}
	return id
}

func fallbackRandomString(length int) string {
    if length <= 0 {
        return ""
    }

    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-"
    charsetLen := len(charset)
    r := rand.New(rand.NewSource(time.Now().UnixNano()))

    var sb strings.Builder
    sb.Grow(length)

    for range length {
        sb.WriteByte(charset[r.Intn(charsetLen)])
    }

    return sb.String()
}