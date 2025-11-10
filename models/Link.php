<?php

namespace micro\models;

use yii\db\ActiveRecord;

class Link extends ActiveRecord
{ 
    public static function tableName()
    {
        return '{{link}}';
    }

    public function rules()
    {
        return [
            [['title', 'hashFrom', 'hashTo', 'xp', 'yp'], 'required'],
        ];
    }

    public function fields()
    {
        return [
            'id',
            'title',
            'hashFrom',
            'hashTo',
            'xp',
            'yp'
        ];
    }
}
