<?php

use yii\db\Migration;

/**
 * Handles the creation of table `{{%link}}`.
 */
class m251109_215156_create_link_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%link}}', [
            'id' => $this->primaryKey(),
            'title' => $this->string(),
            'hashFrom' => $this->string(),
            'hashTo' => $this->string(),
            'xp' => $this->float(),
            'yp' => $this->float(),
        ]);
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropTable('{{%link}}');
    }
}
