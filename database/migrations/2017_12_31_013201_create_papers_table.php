<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePapersTable extends Migration 
{
	public function up()
	{
		Schema::create('papers', function(Blueprint $table) {
            $table->increments('id');
            $table->string('title')->comment('标题');
            $table->unsignedInteger('creator_id')->index()->comment('创建者');
            $table->unsignedInteger('total_score')->default(100)->comment('总分');
            $table->text('content')->comment('内容');
            $table->text('answers')->comment('答案');
            $table->unsignedInteger('time_limit')->default(120)->comment('限时');
            $table->unsignedInteger('participation_count')->default(0)->comment('参与人数');
            $table->timestamps();

            $table->softDeletes();

            $table->foreign('creator_id')->references('id')->on('users')->onDelete('cascade');
        });
	}

	public function down()
	{
		Schema::drop('papers');
	}
}
