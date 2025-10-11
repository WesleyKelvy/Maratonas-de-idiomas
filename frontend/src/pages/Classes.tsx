import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Plus,
  Copy,
  Search,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Classes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClass, setNewClass] = useState({
    name: "",
    description: "",
    expirationDate: "",
  });

  const classes = [
    {
      id: 1,
      name: "Turma de JavaScript - 2024.1",
      code: "JS2024A",
      description: "Turma focada em desenvolvimento web com JavaScript moderno",
      studentCount: 25,
      maxStudents: 30,
      expirationDate: "2024-12-31",
      creator: "Prof. Ana Silva",
      marathons: 5,
      isActive: true,
    },
    {
      id: 2,
      name: "Python para Iniciantes",
      code: "PY2024B",
      description: "Introdução à programação com Python",
      studentCount: 18,
      maxStudents: 25,
      expirationDate: "2024-11-30",
      creator: "Prof. Carlos Santos",
      marathons: 3,
      isActive: true,
    },
    {
      id: 3,
      name: "Algoritmos Avançados",
      code: "ALG2024C",
      description: "Estudo de algoritmos e estruturas de dados complexas",
      studentCount: 12,
      maxStudents: 20,
      expirationDate: "2024-10-15",
      creator: "Prof. Maria Costa",
      marathons: 8,
      isActive: false,
    },
  ];

  const filteredClasses = classes.filter(
    (classItem) =>
      classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateClass = () => {
    if (!newClass.name || !newClass.expirationDate) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e data de expiração são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Turma criada!",
      description: `A turma "${newClass.name}" foi criada com sucesso.`,
    });

    setNewClass({ name: "", description: "", expirationDate: "" });
    setShowCreateModal(false);
  };

  const handleCopyInviteLink = (classCode: string) => {
    const inviteLink = `${window.location.origin}/join-class/${classCode}`;
    navigator.clipboard.writeText(inviteLink);
    toast({
      title: "Link copiado!",
      description:
        "O link de convite foi copiado para a área de transferência.",
    });
  };

  const handleDeleteClass = (classId: number, className: string) => {
    if (
      window.confirm(`Tem certeza que deseja excluir a turma "${className}"?`)
    ) {
      toast({
        title: "Turma excluída",
        description: `A turma "${className}" foi excluída com sucesso.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Turmas</h1>
          <p className="text-gray-600 mt-2">
            Gerencie suas turmas e convide alunos
          </p>
        </div>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Criar Turma
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Turma</DialogTitle>
              <DialogDescription>
                Preencha as informações da nova turma
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome da Turma *</Label>
                <Input
                  id="name"
                  placeholder="Ex: JavaScript Avançado - 2024.1"
                  value={newClass.name}
                  onChange={(e) =>
                    setNewClass({ ...newClass, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descrição da turma..."
                  value={newClass.description}
                  onChange={(e) =>
                    setNewClass({ ...newClass, description: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="expirationDate">
                  Data de Expiração do Convite *
                </Label>
                <Input
                  id="expirationDate"
                  type="date"
                  value={newClass.expirationDate}
                  onChange={(e) =>
                    setNewClass({ ...newClass, expirationDate: e.target.value })
                  }
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button onClick={handleCreateClass} className="flex-1">
                  Criar Turma
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar turmas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Classes List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto max-h-[65dvh] rounded-lg">
        {filteredClasses.map((classItem) => (
          <Card
            key={classItem.id}
            className="hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-xl">{classItem.name}</CardTitle>
                  <div className="flex gap-2">
                    {/* <Badge variant="outline">Código: {classItem.code}</Badge> */}
                    {/* <Badge
                      className={
                        classItem.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {classItem.isActive ? "Ativa" : "Inativa"}
                    </Badge> */}
                  </div>
                </div>
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              {classItem.description && (
                <CardDescription className="text-sm">
                  {classItem.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>
                    {classItem.studentCount}/{classItem.maxStudents} alunos
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>
                    Expira:{" "}
                    {new Date(classItem.expirationDate).toLocaleDateString(
                      "pt-BR"
                    )}
                  </span>
                </div>
                <div className="text-gray-600 text-sm col-span-2">
                  {classItem.marathons} maratonas vinculadas
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/classes/${classItem.id}`)}
                  className="flex-1"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Ver Detalhes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyInviteLink(classItem.code)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleDeleteClass(classItem.id, classItem.name)
                  }
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClasses.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma turma encontrada
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm
                ? "Tente ajustar o termo de busca."
                : "Comece criando sua primeira turma."}
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeira Turma
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Classes;
