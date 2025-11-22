package ucb.app.esculapy.security.jwt;

import java.nio.charset.StandardCharsets;
import ucb.app.esculapy.model.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * Serviço responsável por gerar, extrair informações e validar JSON Web Tokens (JWT).
 */
@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    /**
     * Extrai o nome de usuário (subject) do token JWT.
     *
     * @param token O token JWT.
     * @return O nome de usuário (e-mail).
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extrai uma claim específica do token JWT.
     *
     * @param token O token JWT.
     * @param claimsResolver A função para resolver a claim.
     * @param <T> O tipo de retorno da claim.
     * @return O valor da claim.
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Gera um token JWT com claims padrão (ID e roles) para um {@link UserDetails}.
     *
     * @param userDetails Os detalhes do usuário (deve ser uma instância de {@link Usuario}).
     * @return O token JWT gerado.
     */
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        if (userDetails instanceof Usuario) {
            Usuario usuario = (Usuario) userDetails;
            claims.put("userId", usuario.getId());
            claims.put("roles", usuario.getAuthorities());
        }
        return generateToken(claims, userDetails);
    }

    /**
     * Gera um token JWT com claims extras fornecidas e as informações padrão do usuário.
     *
     * @param extraClaims Claims adicionais a serem incluídas no payload.
     * @param userDetails Os detalhes do usuário.
     * @return O token JWT gerado.
     */
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Verifica se um token JWT é válido (não expirado e pertence ao usuário).
     *
     * @param token O token JWT.
     * @param userDetails Os detalhes do usuário para validação do nome de usuário.
     * @return True se o token for válido, false caso contrário.
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    /**
     * Verifica se o token JWT expirou.
     *
     * @param token O token JWT.
     * @return True se expirado, false caso contrário.
     */
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Extrai a data de expiração do token.
     *
     * @param token O token JWT.
     * @return A data de expiração.
     */
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Extrai todas as claims do token.
     *
     * @param token O token JWT.
     * @return As claims (payload) do token.
     */
    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Gera a chave de assinatura (Key) a partir do segredo configurado.
     *
     * @return A chave de assinatura.
     */
    private Key getSignInKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}