
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal, ShieldAlert, ShieldCheck } from "lucide-react";
import { useUserManagement } from "../../hooks/useUserManagement";
import { Badge } from "../ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function UserTable() {
    const { users, loading, error, updateUserRole, toggleUserSuspension } =
        useUserManagement();

    if (loading) {
        return <div className="text-center py-10">Loading users...</div>;
    }

    if (error) {
        return (
            <div className="text-center py-10 text-red-500">
                Error: {error}. Please try refreshing.
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">
                                <div className="flex items-center space-x-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.avatar_url || ""} aria-label={user.full_name || "User Avatar"} />
                                        <AvatarFallback>{user.full_name?.[0] || "U"}</AvatarFallback>
                                    </Avatar>
                                    <span>{user.full_name}</span>
                                </div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <Select
                                    defaultValue={user.role}
                                    onValueChange={(value: "user" | "admin") =>
                                        updateUserRole(user.id, value)
                                    }
                                // Disable role change for self to prevent lockout? 
                                // For now, allow it but maybe add warning later.
                                >
                                    <SelectTrigger className="w-[100px]">
                                        <SelectValue placeholder="Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="user">User</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell>
                                {user.is_suspended ? (
                                    <Badge variant="destructive">Suspended</Badge>
                                ) : (
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem
                                            onClick={() => navigator.clipboard.writeText(user.id)}
                                        >
                                            Copy User ID
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        {user.is_suspended ? (
                                            <DropdownMenuItem
                                                className="text-green-600 focus:text-green-600 focus:bg-green-50"
                                                onClick={() => toggleUserSuspension(user.id, false)}
                                            >
                                                <ShieldCheck className="mr-2 h-4 w-4" />
                                                Unsuspend User
                                            </DropdownMenuItem>
                                        ) : (
                                            <DropdownMenuItem
                                                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                                onClick={() => toggleUserSuspension(user.id, true)}
                                            >
                                                <ShieldAlert className="mr-2 h-4 w-4" />
                                                Suspend User
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
