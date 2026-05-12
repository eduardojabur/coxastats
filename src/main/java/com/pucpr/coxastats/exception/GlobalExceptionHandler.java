package com.pucpr.coxastats.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. Trata o temido Erro 500 (Qualquer exceção não mapeada cai aqui)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErroResposta> tratarErroGlobal(Exception ex, HttpServletRequest request) {
        ErroResposta erro = new ErroResposta(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Erro Interno do Servidor",
                "Ocorreu um erro inesperado. Nossa equipe já foi notificada.", // Mensagem amigável!
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(erro);
    }

    // 2. Trata Erro 404 para rotas que não existem
    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<ErroResposta> tratarRotaNaoEncontrada(NoHandlerFoundException ex, HttpServletRequest request) {
        ErroResposta erro = new ErroResposta(
                HttpStatus.NOT_FOUND.value(),
                "Recurso Não Encontrado",
                "A URL solicitada não existe nesta API.",
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(erro);
    }

    // 3. Trata exceções de argumentos inválidos (ex: enviar JSON com formato errado)
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErroResposta> tratarArgumentoInvalido(IllegalArgumentException ex, HttpServletRequest request) {
        ErroResposta erro = new ErroResposta(
                HttpStatus.BAD_REQUEST.value(),
                "Requisição Inválida",
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
    }
}