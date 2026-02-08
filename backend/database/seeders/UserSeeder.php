<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Admin
        User::create([
            'email' => 'admin@example.com',
            'phone_number' => '0987654321',
            'first_name' => 'Admin',
            'last_name' => 'User',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
        ]);

        // Member
        User::create([
            'email' => 'user@example.com',
            'phone_number' => '0123456789',
            'first_name' => 'Test',
            'last_name' => 'User',
            'password' => Hash::make('123456'),
            'role' => 'member',
        ]);
    }
}
