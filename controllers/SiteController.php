<?php

namespace micro\controllers;

use yii\web\Controller;

class SiteController extends Controller
{
    public function actionIndex()
    {
        return $this->renderPartial("index");
    }

    public function actionAddNode() {
        return '<script
			  src="https://code.jquery.com/jquery-3.7.1.min.js"
			  integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo="
			  crossorigin="anonymous"></script>
        <script>
        $(document).ready(() => {
            $.ajax({
                url: "/node/create",
                type: "POST",
                data: {
                    title: "Post 1",
                    hash: "asdfasdfasdf",
                    img: "default.png"
                },
                success: function(response) {
                    console.log(response);
                },
                error: function(xhr, status, error) {
                    console.log(error);
                }
            });
        })
        </script>';
    }
}
