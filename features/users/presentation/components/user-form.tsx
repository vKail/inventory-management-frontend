'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userSchema, UserFormValues } from '../../data/schemas/user-schema'
import { UserRole } from '../../data/enums/user-roles.enums'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useUserStore } from '../../context/user-store'

interface UserFormProps {
    id?: string;
}

export default function UserForm({ id }: UserFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const { getUserById, addUser, updateUser } = useUserStore()

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
                setLoading(true)
                const data = await getUserById(parseInt(id))
                if (data) {
                    form.reset({
                        userName: data.userName,
                        ...(data.password ? { password: data.password } : {}),
                        career: data.career,
                        userType: data.userType as UserRole,
                        person: {
                            dni: data.person.dni,
                            firstName: data.person.firstName,
                            lastName: data.person.lastName,
                            email: data.person.email,
                        },
                    })
                }
            } catch (error) {
                console.error('Error fetching user:', error)
                toast.error('Error al cargar el usuario')
            } finally {
                setLoading(false)
            }
        }

        loadUser()
    }, [id, form, getUserById])

    const onSubmit = async (data: UserFormValues) => {
        setLoading(true)
        try {
            if (id) {
                await updateUser(parseInt(id), {
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
                toast.success('Usuario actualizado exitosamente')
            } else {
                await addUser({
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
                toast.success('Usuario creado exitosamente')
            }

            router.push('/users')
        } catch (error) {
            console.error('Error saving user:', error)
            toast.error('Error al guardar el usuario')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center w-full px-6 md:px-12">
            <div className="w-full max-w-[1200px]">
                <Card>
                    <CardHeader>
                        <CardTitle>{id ? 'Editar Usuario' : 'Nuevo Usuario'}</CardTitle>
                        <CardDescription>
                            {id ? 'Actualiza la información del usuario' : 'Completa el formulario para crear un nuevo usuario'}
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
                                                    <Input placeholder="Nombre de usuario" {...field} />
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
                                                        placeholder="Facultad"
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
                                        name="userType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tipo de Usuario</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecciona un tipo" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {Object.values(UserRole).map((role) => (
                                                            <SelectItem key={role} value={role}>
                                                                {role}
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
                                        name="person.firstName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nombre</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nombre" {...field} />
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
                                                    <Input placeholder="Apellido" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="person.email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="correo@ejemplo.com"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {!id && (
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Contraseña</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="password"
                                                            placeholder="Contraseña"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.push('/users')}
                                        disabled={loading}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button type="submit" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                {id ? 'Actualizando...' : 'Creando...'}
                                            </>
                                        ) : (
                                            id ? 'Actualizar' : 'Crear'
                                        )}
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
