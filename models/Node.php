<?php

namespace micro\models;

use yii\db\ActiveRecord;

class Node extends ActiveRecord
{ 
    public static function tableName()
    {
        return '{{node}}';
    }

    public function rules()
    {
        return [
            [['title', 'hash', 'img'], 'required'],
        ];
    }

    public function fields()
    {
        return [
            'id',
            'title',
            'hash',
            'img'
        ];
    }
}
