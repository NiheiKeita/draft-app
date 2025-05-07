<?php

namespace App\Services\Entity\Response;

class GetBuildingsResponse
{
    /**
     * @return Building[]
     */
    public function getResponse(array $response): array
    {
        $buildings = array_map(function ($array) {
            return new Building($array);
        }, $response);
        return $buildings;
    }
}
