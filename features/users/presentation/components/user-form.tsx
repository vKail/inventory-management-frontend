'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Resolver, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IUser } from '@/features/users/data/interfaces/user.interface'
import { userSchema, UserFormValues, UserRole, UserStatus } from '@/features/users/data/schemas/user.schema'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbPage, BreadcrumbLink } from '@/components/ui/breadcrumb'
import { Users } from 'lucide-react'

interface UserFormProps {
    initialData?: IUser;
    onSubmit: (data: UserFormValues) => Promise<void>;
    isLoading: boolean;
}

export default function UserForm({ initialData, onSubmit, isLoading }: UserFormProps) {
    const router = useRouter()
    const isEdit = !!initialData

    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            userName: '',
            password: '',
            career: '',
            userType: UserRole.ADMINISTRATOR,
            status: UserStatus.ACTIVE,
            person: {
                dni: '',
                firstName: '',
                lastName: '',
                email: '',
                phone: ''
            }
        },
    })

    useEffect(() => {
        if (initialData) {
            form.reset({
                userName: initialData.userName,
                password: '',
                career: initialData.career || '',
                userType: initialData.userType as UserRole,
                status: initialData.status as UserStatus,
                person: {
                    dni: initialData.person?.dni || '',
                    firstName: initialData.person?.firstName || '',
                    lastName: initialData.person?.lastName || '',
                    email: initialData.person?.email || '',
                    phone: initialData.person?.phone || ''
                }
            })
        }
    }, [initialData, form])

    const handleSubmit = async (data: UserFormValues) => {
        // Set person.type based on userType
        let personType = 'DOCENTES';
        if (data.userType === UserRole.STUDENT) {
            personType = 'ESTUDIANTES';
        }
        const submitData = {
            ...data,
            person: {
                ...data.person,
                type: personType
            }
        };
        try {
            await onSubmit(submitData);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    }

    return (
        <div className="flex flex-col items-center w-full">
            <div className="w-full">
                {/* Breadcrumb */}
                <Breadcrumb className="mb-6">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <span className="text-muted-foreground font-medium">Administración</span>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/users">
                                <Users className="inline mr-1 h-4 w-4 text-primary align-middle" />
                                <BreadcrumbPage>Usuarios</BreadcrumbPage>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{isEdit ? 'Editar Usuario' : 'Nuevo Usuario'}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <Card>
                    <CardHeader>
                        <CardTitle>{isEdit ? 'Editar Usuario' : 'Nuevo Usuario'}</CardTitle>
                        <CardDescription>
                            {isEdit ? 'Actualiza la información del usuario' : 'Completa el formulario para crear un nuevo usuario'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                form.handleSubmit(handleSubmit)(e);
                            }} className="space-y-8">
                                {/* Sección: Información de Usuario */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium border-b pb-2">Información de Usuario</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                                        {!isEdit && (
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

                                        <FormField
                                            control={form.control}
                                            name="userType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Tipo de Usuario</FormLabel>
                                                    <Select
                                                        onValueChange={(value) => field.onChange(value as UserRole)}
                                                        defaultValue={field.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Selecciona un tipo" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value={UserRole.ADMINISTRATOR}>
                                                                Administrador
                                                            </SelectItem>
                                                            <SelectItem value={UserRole.MANAGER}>
                                                                Gestor
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
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
                                    </div>
                                </div>

                                {/* Sección: Información Personal */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium border-b pb-2">Información Personal</h3>
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

                                        <FormField
                                            control={form.control}
                                            name="person.firstName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nombre *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Nombre del usuario"
                                                            maxLength={30}
                                                            textOnly={true}
                                                            shouldAutoCapitalize={true}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <div className="text-xs text-muted-foreground text-right">
                                                        {field.value?.length || 0}/30 caracteres
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="person.lastName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Apellido *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Apellido del usuario"
                                                            maxLength={30}
                                                            textOnly={true}
                                                            shouldAutoCapitalize={true}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <div className="text-xs text-muted-foreground text-right">
                                                        {field.value?.length || 0}/30 caracteres
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="person.phone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Teléfono (Opcional)</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Teléfono" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.push('/users')}
                                        disabled={isLoading}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                {isEdit ? 'Actualizando...' : 'Creando...'}
                                            </>
                                        ) : (
                                            isEdit ? 'Actualizar' : 'Crear'
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
