<?php

namespace micro\models;

class LinkSearch extends \yii\base\Model
{
    public $hashFrom;
    
    public function rules()
    {
        return [
            [['hashFrom'], 'safe'],
        ];
    }
    
    public function search($params)
    {
        $query = Link::find();
        
        $dataProvider = new \yii\data\ActiveDataProvider([
            'query' => $query,
        ]);
        
        $this->load($params, '');
        
        if (!$this->validate()) {
            return $dataProvider;
        }
        
        $query->andFilterWhere(['hashFrom' => $this->hashFrom]);

        return $dataProvider;
    }
}