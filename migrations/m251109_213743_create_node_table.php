<?php

use yii\db\Migration;

/**
 * Handles the creation of table `{{%node}}`.
 */
class m251109_213743_create_node_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%node}}', [
            'id' => $this->primaryKey(),
            'title' => $this->string(),
            'hash' => $this->string(),
            'img' => $this->string(),
        ]);
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropTable('{{%node}}');
    }
}
