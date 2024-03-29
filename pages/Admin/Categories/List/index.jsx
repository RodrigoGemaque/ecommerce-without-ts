// Styles
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faGhost } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import styles from '../../../../styles/AdminPanel.module.css'

// components
import withAuthAdmin from '../../../../components/withAuthAdmin';
import NoData from '../../../../components/shared/NoData';
import AdminDeleteModal from '../../../../components/shared/AdminDeleteModal';
import AdminListTable from '../../../../components/shared/AdminListTable';
import TitleAdminPanel from '../../../../components/shared/TitleAdminPanel';
import AdminComponent from '../../../../components/shared/AdminComponent';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { setCategoryToEdit } from '../../../../store/modules/admin/category/reducer';



// configs
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import CategoriesService from '../../../../services/categories';
import { useRouter } from 'next/router';

const defaultUrl = '/admin/v1/categories';
import UrlService from '../../../../util/UrlServices';



const List = () => {
  // estado para controlar a exibição do modal de exclusão
  const [show, setShow] = useState(false);
  // estado para armazena o id da categoria para remoção, ao clicar no ícone para remover uma categoria, esse estado é atualizado
  const [categoryToRemove, setCategoryToRemove] = useState(0);
  // estado utilizado para forçar a revalidaçãod e cache do SWR, toda vez que o mesmo mudar o SWR irá realizar uma revalidação de cache
  const [url, setUrl] = useState(defaultUrl);

  const { data, error, mutate } = useSWR(url, CategoriesService.index);

  console.log(data)
  // obento o estado de pesquisa do redux para observá-lo e a cada mudanção mudar o estado local url
  const search = useSelector(state => state.search);

  const dispatch = useDispatch();
  const router = useRouter();

  // se o search mudar (usuário deve alterar o valor do campo e teclar enter)
  // a pesquisa será feita ao alterar o url do SWR
  useEffect(() => {
    setUrl(
      defaultUrl +
      UrlService.execute({ page: router.query.page, search })
    )
  }, [search, router.query.page]);

  // mostrando o motal de remoção e setando o id para remoção da categoria
  const handleShow = (id) => {
    setShow(true);
    setCategoryToRemove(id);
  }

  // fechando o modal e caso o usuário clique em ok (success true) a categoria será removida, case o usuário clique em cancelar (success false), a categoria não será removida
  const handleClose = async (success) => {
    setShow(false);

    if (!success) return;

    try {
      // realizando a request para remoção da categoria utilizando o id salvo anteriormente
      await CategoriesService.delete(categoryToRemove);
      toast.info('Categoria removida com sucesso!');
      // função do SWR para forçar a revalidação do cache
      mutate();
    } catch (err) {
      toast.error('Ocorreu um erro ao remover uma categoria, tente novamente.');
      console.log(err);
    }
  }

  // ao clicar no item de edição a categoria selecionada para edição é armazenada no redux e o usuário é redirecionado para a edição
  const handleEdit = (category) => {
    dispatch(setCategoryToEdit(category));
    router.push('/Admin/Categories/Edit');
  }

  if (error) {
    toast.error('Erro ao listar categorias');
    console.log(error);
  }

  return (
    <AdminComponent>
      <TitleAdminPanel
        title="Categorias"
        path="Dashboard > Categorias"
        icon={faGhost}
        newPath="/Admin/Categories/New" />

      <AdminDeleteModal handleClose={handleClose} show={show} target="categoria" />

      {
        // caso não existam dados cadastrados ou a pesquisa não tenha resultado o componente NoData é renderizado.
        data && data.categories && data.categories.length > 0 ? (
          <AdminListTable first_title="Nome da categoria" meta={data.meta}>
            {
              data.categories.map(category => (
                <tr className={styles.table_line} key={category.id}>
                  <td>{category.name}</td>
                  <td>
                    <div className={styles.hover}>
                      <FontAwesomeIcon
                        icon={faEdit}
                        onClick={() => handleEdit(category)}
                      />
                    </div>
                  </td>

                  <td>
                    <div className={styles.hover}>
                      <FontAwesomeIcon
                        icon={faTrash}
                        onClick={() => handleShow(category.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            }
          </AdminListTable>
        ) : (
          <NoData />
        )
      }
    </AdminComponent>
  )
}

export default withAuthAdmin(List);