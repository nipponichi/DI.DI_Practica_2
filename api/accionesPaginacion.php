
<?php

class accionesPaginacion {

    // Obtiene la paginación para navegar por listado web
    public static function obtenerPaginacion($total, $registrosPagina, $numeroPagina) {

        // Total de paginas
        $paginas = ceil($total / $registrosPagina);

        // Controla el descuadre de última página
        $registrosUltimaPagina = $total % $registrosPagina;

        if ($registrosUltimaPagina === 0) {
            $registrosUltimaPagina = $registrosPagina;
        }

        // Resultado de la paginación
        $resultadoPaginacion = ['registrosPagina' => $registrosPagina, 'totalPaginas' => $paginas,
        'registrosUltimaPagina' => $registrosUltimaPagina, 'paginaActual' => $numeroPagina];

        // Añade las páginas adicionales al resultado
        $resultadoPaginacion['paginasAdicionales'] = self::obtenerPaginasAdicionales($numeroPagina, $paginas);

        return $resultadoPaginacion;
    }

    // Devuelve el número de páginas a mostrar para desplazarnos rápidamente
    public static function obtenerPaginasAdicionales($numeroPagina, $totalPaginas) {

        // Si hay menos de 5 páginas
        if ($totalPaginas <= 5) {
            return range(1, $totalPaginas);
        }
    
        // Si la página actual es una de las 3 primeras
        if ($numeroPagina <= 3) {
            return range(1, 5);
        }
    
        // Si la página actual es una de las 3 últimas
        if ($numeroPagina >= $totalPaginas - 2) {
            return range($totalPaginas - 4, $totalPaginas);
        }
    
        // Para cualquier otro caso, devolvemos 2 páginas antes y 2 después
        return range($numeroPagina - 2, $numeroPagina + 2);
    }
    
}    