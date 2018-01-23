<?php

 namespace Tests\Feature;

 use Tests\TestCase;

 class AuthTest extends TestCase
 {
     public function testLogin()
     {
         $response = $this->json('POST', '/api/auth/login', [
             'email' => 'luoxwen@gmail.com',
             'password' => '111111',
         ]);

         $response->assertStatus(200)->assertJson([
             'errors' => 0,
         ]);

         $response = $this->json('POST', '/api/auth/login', [
             'email' => 'luoxwen@gmail.com',
             'password' => '222223',
         ]);
         $response->assertStatus(200)->assertJson([
             'errors' => 1,
             'msg' => 'login failed',
         ]);

         $response = $this->json('POST', '/api/auth/login', [
             'email' => 'luoxwen22@gmail.com',
             'password' => '111111',
         ]);
         $response->assertStatus(200)->assertJson([
             'errors' => 1,
             'msg' => 'login failed',
         ]);

         $response = $this->json('POST', '/api/auth/login', [
             'email' => 'luoxwen',
             'password' => '222223',
         ]);
         $response->assertStatus(422);

         echo 'Test Login Pass';
     }
 }