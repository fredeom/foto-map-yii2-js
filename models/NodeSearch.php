<?php

namespace micro\models;

class NodeSearch extends \yii\base\Model
{
    public $hash;
    public $title = '';
    
    public function rules()
    {
        return [
            [['hash', 'title'], 'safe'],
        ];
    }
    
    public function search($params)
    {
        $query = Node::find();
        
        $dataProvider = new \yii\data\ActiveDataProvider([
            'query' => $query,
        ]);
        
        $this->load($params, '');
        
        if (!$this->validate()) {
            return $dataProvider;
        }
        
        $query->andFilterWhere(['hash' => $this->hash]);
        $query->andFilterWhere(['LIKE', 'title', '%' . $this->title . '%', false]);

        return $dataProvider;
    }
}