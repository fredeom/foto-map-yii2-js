<?php

namespace micro\controllers;

use micro\models\Link;
use micro\models\Node;
use micro\models\NodeSearch;
use Yii;
use yii\db\Expression;
use yii\rest\ActiveController;
use yii\web\UploadedFile;

class NodeController extends ActiveController
{
    public $modelClass = 'micro\models\Node';

    public function behaviors()
    {
        $behaviors = parent::behaviors();
        unset($behaviors['rateLimiter']);
        
        $behaviors['contentNegotiator'] = [
            'class' => \yii\filters\ContentNegotiator::class,
            'formats' => [
                'application/json' => \yii\web\Response::FORMAT_JSON,
            ],
        ];

        return $behaviors;
    }

    public function actions()
    {
        $actions = parent::actions();
        
        $actions['index']['dataFilter'] = [
            'class' => \yii\data\ActiveDataFilter::class,
            'searchModel' => NodeSearch::class,
        ];
        
        return $actions;
    }

    public function actionChangeImage() {
        $file = UploadedFile::getInstanceByName('file');

        $hash = Yii::$app->security->generateRandomString(10);
        $file->saveAs('images/' . $hash . '.' . $file->extension);

        $node = new Node;
        $node->title = 'New Location';
        $node->hash = $hash;
        $node->img = 'images/' . $hash . '.' . $file->extension;
        $node->save();

        return ['hash' => $hash, 'img' => $node->img];
    }

    public function actionDeleteItAndAllLinks($id) {
        if ($id == 'undefined' || $id == 'null') {
            Link::deleteAll(['hashFrom' => 'default']);
        } else {
            $node = Node::findOne($id);
            Link::deleteAll(['hashFrom' => $node->hash]);
            Link::updateAll(['hashTo' => new Expression('hashFrom')], ['hashTo' => $node->hash]);
            $node->delete();
        }
        return ['ok'];
    }
}
