'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userSchema, UserFormValues } from '../../data/schemas/user-schema'
import {
    fetchUserById,
    createUser,
    updateUser,
} from '../../services/user.service'
import { UserRole } from '../../data/enums/user-roles.enums'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function UserForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const id = searchParams.get('id')

    const [loading, setLoading] = useState(false)

    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            userName: '',
            career: 'FISEI',
            person: {
                firstName: '',
                lastName: '',
                email: '',
            },
        },
    })

    useEffect(() => {
        if (!id) return

        const loadUser = async () => {
            try {
                const data = await fetchUserById(id)
                form.reset({
                    userName: data.userName,
                    ...(data.password ? { password: data.password } : {}),
                    career: data.career,
                    userType: data.userType as 'STUDENT' | 'TEACHER' | 'ADMINISTRATOR' | 'MANAGER',
                    person: {
                        dni: data.person.dni,
                        firstName: data.person.firstName,
                        lastName: data.person.lastName,
                        email: data.person.email,
                    },
                })

            } catch (error) {
                console.error('Error fetching user:', error)
            }
        }

        loadUser()
    }, [id, form])


    const onSubmit = async (data: UserFormValues) => {
        setLoading(true)
        try {
            if (id) {
                await updateUser(id, {
                    userName: data.userName,
                    career: data.career,
                    userType: data.userType,
                    person: {
                        dni: data.person.dni,
                        firstName: data.person.firstName,
                        lastName: data.person.lastName,
                        email: data.person.email,
                    },
                    ...(data.password ? { password: data.password } : {}),
                })
                toast.success('User updated successfully')
            } else {
                await createUser({
                    userName: data.userName,
                    career: data.career,
                    userType: data.userType,
                    password: data.password,
                    status: 'ACTIVE',
                    person: {
                        dni: data.person.dni,
                        firstName: data.person.firstName,
                        lastName: data.person.lastName,
                        email: data.person.email,
                    },
                })
                toast.success('User created successfully')
            }

            setTimeout(() => router.push('/users'), 1500)
        } catch (error) {
            toast.error('Error saving user')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }



    return (
        <div className="flex flex-col items-center w-full px-6 md:px-12">
            <div className="w-full max-w-[1200px]">
                <Card>
                    <CardHeader>
                        <CardTitle>{id ? 'Edit User' : 'New User'}</CardTitle>
                        <CardDescription>
                            {id ? 'Update user information' : 'Fill in the form to create a new user'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="person.dni"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>DNI</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="DNI" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="userName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Usuario</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Username" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="career"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Facultad</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Career"
                                                        value="FISEI"
                                                        disabled
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="person.firstName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nombre</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="First Name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="person.lastName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Apellido</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Last Name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="userType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Rol</FormLabel>
                                                <Select
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a role" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {Object.entries(UserRole).map(([key, value]) => (
                                                            <SelectItem key={key} value={value}>
                                                                {value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>

                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="person.email"
                                        render={({ field }) => (
                                            <FormItem className="">
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Email" type="email" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Contraseña</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="Password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />


                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.push('/users')}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={loading}>
                                        {loading ? 'Saving...' : id ? 'Update' : 'Create'}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
