import { useEffect, useState } from 'react';
import { Container, Typography, Button, TextField, Box, Grid, Card, CardContent, Alert, Dialog, DialogActions, DialogContent, DialogTitle, Stack, IconButton } from '@mui/material';
import { useRestaurant } from '../../../hooks/useRestaurant';
import { getItemsByRestaurante, registerItem, updateItem, deleteItemByRestaurante } from '../../../services/ItemService';
import IItemModel from '../../../interfaces/IItemModel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const ManageItemsRestaurant = () => {
    const { restaurantId } = useRestaurant();
    const [items, setItems] = useState<IItemModel[]>([]);
    const [newItem, setNewItem] = useState<Omit<IItemModel, 'idItem' | 'idRestaurant'>>({ name: '', description: '', price: 0 });
    const [editItem, setEditItem] = useState<IItemModel | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<IItemModel | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItems = async () => {
            if (restaurantId) {
                try {
                    const result = await getItemsByRestaurante(restaurantId);

                    if ('message' in result) {
                        setError(result.message);
                    } else {
                        setItems(result);
                    }
                } catch {
                    setError('Erro ao buscar itens.');
                }
            }
        };
        fetchItems();
    }, [restaurantId]);

    const handleCreateItem = async () => {
        if (!restaurantId) {
            setError('ID do restaurante não encontrado.');
            return;
        }

        try {
            await registerItem({ ...newItem, idRestaurant: restaurantId });
            setSuccess('Item criado com sucesso.');
            setNewItem({ name: '', description: '', price: 0 });

            const updatedItems = await getItemsByRestaurante(restaurantId);

            if ('message' in updatedItems) {
                setError(updatedItems.message);
            } else {
                setItems(updatedItems);
            }
        } catch {
            setError('Erro ao criar item.');
        }
    };

    const handleUpdateItem = async () => {
        if (!editItem || !restaurantId) return;

        const { idItem, name, description, price } = editItem;

        if (idItem) {
            try {
                const result = await updateItem(idItem, { name, description, price, idRestaurant: restaurantId });

                if (result && 'message' in result) {
                    setError(result.message);
                } else {
                    setSuccess('Item atualizado com sucesso.');
                    setEditItem(null);
                    setOpenEditDialog(false);

                    const updatedItems = await getItemsByRestaurante(restaurantId);

                    if ('message' in updatedItems) {
                        setError(updatedItems.message);
                    } else {
                        setItems(updatedItems);
                    }
                }
            } catch {
                setError('Erro ao atualizar item.');
            }
        } else {
            setError('ID do item não está definido.');
        }
    };

    const handleEditButtonClick = (item: IItemModel) => {
        setEditItem(item);
        setOpenEditDialog(true);
    };

    const handleDeleteButtonClick = (item: IItemModel) => {
        setItemToDelete(item);
        setOpenDeleteDialog(true);
    };

    const handleDeleteItem = async () => {
        if (!itemToDelete || !restaurantId) return;

        try {
            if(itemToDelete.idItem){

                const result = await deleteItemByRestaurante(itemToDelete.idItem, restaurantId);
                if (result && 'message' in result) {
                    setError(result.message);
                } else {
                    setSuccess('Item excluído com sucesso.');
                    setItems(items.filter(item => item.idItem !== itemToDelete.idItem));
                    setOpenDeleteDialog(false);
                }
            }
        } catch {
            setError('Erro ao excluir item.');
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <ArrowBackIcon onClick={() => navigate("/restaurante")} sx={{ cursor: "pointer" }} color='primary' fontSize='large' />
            <Typography variant="h4" gutterBottom>
                Gerenciar Itens
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            <Box mb={4}>
                <Typography variant="h6">Adicionar Novo Item</Typography>
                <TextField
                    name="name"
                    label="Nome"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    name="description"
                    label="Descrição"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    name="price"
                    label="Preço"
                    type="number"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <Button
                    variant="contained"
                    onClick={handleCreateItem}
                    fullWidth
                >
                    Adicionar Item
                </Button>
            </Box>
            <Typography variant="h6" gutterBottom>
                Itens do Restaurante
            </Typography>
            <Grid container spacing={2}>
                {items.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.idItem}>
                        <Card>
                            <CardContent sx={{ height: 150 }}>
                                <Typography variant="h6">{item.name}</Typography>
                                <Typography variant="body2">Descrição: {item.description}</Typography>
                                <Typography variant="body2">Preço: R${item.price.toFixed(2)}</Typography>
                            </CardContent>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" margin={1}>
                                <Button onClick={() => handleEditButtonClick(item)}>Editar</Button>
                                <IconButton onClick={() => handleDeleteButtonClick(item)} aria-label="delete">
                                    <DeleteIcon />
                                </IconButton>
                            </Stack>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {editItem && (
                <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                    <DialogTitle>Editar Item</DialogTitle>
                    <DialogContent>
                        <TextField
                            name="name"
                            label="Nome"
                            value={editItem.name}
                            onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                            fullWidth
                            sx={{ mb: 2, marginTop: 2 }}
                        />
                        <TextField
                            name="description"
                            label="Descrição"
                            value={editItem.description}
                            onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            name="price"
                            label="Preço"
                            type="number"
                            value={editItem.price}
                            onChange={(e) => setEditItem({ ...editItem, price: parseFloat(e.target.value) })}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenEditDialog(false)}>Cancelar</Button>
                        <Button onClick={handleUpdateItem}>Salvar</Button>
                    </DialogActions>
                </Dialog>
            )}

            {itemToDelete && (
                <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                    <DialogTitle>Confirmar Exclusão</DialogTitle>
                    <DialogContent>
                        <Typography>Tem certeza de que deseja excluir o item "{itemToDelete.name}"?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
                        <Button onClick={handleDeleteItem} color="error">Excluir</Button>
                    </DialogActions>
                </Dialog>
            )}
        </Container>
    );
};

export default ManageItemsRestaurant;
