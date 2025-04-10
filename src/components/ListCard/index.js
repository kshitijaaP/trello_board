import { IconButton, TextField } from "@mui/material";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CardModal from "../CardModal";
import ListModal from "../ListModal";
import CloseIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ListCard({ list, updateList }) {
  const [showCardInput, setShowCardInput] = useState({});
  const [cardTitles, setCardTitles] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [activeDragItem, setActiveDragItem] = useState(null);
  const [listArray, setListArray] = useState([]);
  const [isEditTitle, setIsEditTitle] = useState(false);
  const [listElemenet, setListElement] = useState("");
  const [listElementIndex, setListElementIndex] = useState("");

  useEffect(() => {
    const storedData = localStorage.getItem("board");
    if (storedData) {
      const parsed = JSON.parse(storedData);
      setCardTitles(parsed.cardTitles || {});
      setListArray(parsed.listArray || []);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(cardTitles)?.length > 0) {
      const boardData = {
        cardTitles,
        listArray,
      };

      localStorage.setItem("board", JSON.stringify(boardData));
    }
  }, [cardTitles, listArray]);

  useEffect(() => {
    if (list) {
      setListArray(list);
    }
  }, [list]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleAddCardClick = (index) => {
    setShowCardInput((prev) => ({ ...prev, [index]: true }));
  };

  const handleInputChange = (index, value) => {
    setInputValues((prev) => ({ ...prev, [index]: value }));
  };

  const handleSave = (index) => {
    const trimmed = inputValues[index]?.trim();
    if (!trimmed) return;

    setCardTitles((prev) => ({
      ...prev,
      [index]: [
        ...(prev[index] || []),
        { title: trimmed, description: "", date: "" },
      ],
    }));

    setInputValues((prev) => ({ ...prev, [index]: "" }));
    setShowCardInput((prev) => ({ ...prev, [index]: false }));
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const activeId = active.id;

    for (let i = 0; i < listArray.length; i++) {
      if ((cardTitles[i] || []).includes(activeId)) {
        setActiveDragItem({ id: activeId, listIndex: i });
        break;
      }
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!active || !over || !activeDragItem) return;

    const fromList = activeDragItem.listIndex;
    const toList = over?.data?.current?.listIndex;

    if (toList === undefined || fromList === undefined) return;

    if (fromList === toList) {
      const fromCards = [...(cardTitles[fromList] || [])];
      const oldIndex = fromCards.indexOf(active.id);
      const newIndex = fromCards.indexOf(over.id);
      if (oldIndex !== newIndex) {
        const newOrder = arrayMove(fromCards, oldIndex, newIndex);
        setCardTitles((prev) => ({
          ...prev,
          [fromList]: newOrder,
        }));
      }
    } else {
      const fromCards = [...(cardTitles[fromList] || [])];
      const toCards = [...(cardTitles[toList] || [])];

      const fromIndex = fromCards.indexOf(active.id);
      fromCards.splice(fromIndex, 1);

      const toIndex = toCards.indexOf(over.id);
      toCards.splice(toIndex === -1 ? toCards.length : toIndex, 0, active.id);

      setCardTitles((prev) => ({
        ...prev,
        [fromList]: fromCards,
        [toList]: toCards,
      }));
    }

    setActiveDragItem(null);
  };

  const deleteBtn = (index) => {
    const updatedCardTitles = { ...cardTitles };
    delete updatedCardTitles[index];

    const shiftedTitles = {};
    Object.keys(updatedCardTitles).forEach((key) => {
      const numKey = parseInt(key);
      shiftedTitles[numKey > index ? numKey - 1 : numKey] =
        updatedCardTitles[key];
    });

    setCardTitles(shiftedTitles);
    updateList(index);
  };

  const handleEditSave = (name) => {
    const updated = [...listArray];
    updated[listElementIndex] = name;
    setListArray(updated);
  };
  const updateCardTitle = (listIndex, oldTitle, updatedCard) => {
    const updatedCards = [...(cardTitles[listIndex] || [])];
    const idx = updatedCards.findIndex((card) => card.title === oldTitle);
    if (idx !== -1) {
      updatedCards[idx] = updatedCard;
      setCardTitles((prev) => ({
        ...prev,
        [listIndex]: updatedCards,
      }));
    }
  };
  const deleteCardData = (listIndex, cardTitleToDelete) => {
    const updatedCards = [...(cardTitles[listIndex] || [])];
    const filteredCards = updatedCards.filter(
      (card) => card.title !== cardTitleToDelete
    );

    setCardTitles((prev) => ({
      ...prev,
      [listIndex]: filteredCards,
    }));
  };

  return (
    <>
      <div
        className={styles.scrollContainer}
        style={{
          display: "flex",
          overflowX: "auto",
          gap: "16px",
        }}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {listArray?.map((element, index) => (
            <div
              key={index}
              className={styles.cardcontainer}
              style={{ minWidth: "300px" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h2>{element}</h2>
                <div>
                  <IconButton
                    onClick={() => {
                      setIsEditTitle(true);
                      setListElement(element);
                      setListElementIndex(index);
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                  <IconButton onClick={() => deleteBtn(index)}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              </div>

              <DroppableContainer id={index}>
                <SortableContext
                  items={cardTitles[index] || []}
                  strategy={verticalListSortingStrategy}
                >
                  {(cardTitles[index] || []).map((card) => (
                    <SortableItem
                      key={card.title}
                      card={card}
                      listIndex={index}
                      updateCardData={updateCardTitle}
                      deleteCardData={deleteCardData}
                    />
                  ))}
                </SortableContext>
              </DroppableContainer>

              {showCardInput[index] ? (
                <>
                  <TextField
                    fullWidth
                    placeholder="Enter title name..."
                    variant="standard"
                    value={inputValues[index] || ""}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    InputProps={{
                      disableUnderline: true,
                      sx: {
                        marginTop: "20px",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        padding: "10px 12px",
                        fontSize: "16px",
                        backgroundColor: "#f9f9f9",
                        "&:hover": {
                          borderColor: "#999",
                        },
                        "&:focus-within": {
                          borderColor: "#1976d2",
                          boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
                        },
                      },
                    }}
                  />
                  <button
                    className={styles.addNewCardBtn}
                    onClick={() => handleSave(index)}
                  >
                    Save
                  </button>
                </>
              ) : (
                <button
                  className={styles.addNewCardBtn}
                  onClick={() => handleAddCardClick(index)}
                >
                  Add New Card
                </button>
              )}
            </div>
          ))}
        </DndContext>
      </div>

      <ListModal
        open={isEditTitle}
        name={listElemenet}
        onClose={() => setIsEditTitle(false)}
        onSave={handleEditSave}
      />
    </>
  );
}

function DroppableContainer({ id, children }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${id}`,
    data: { listIndex: id },
  });

  const hasChildren = Array.isArray(children) && children.length > 0;

  return (
    <div
      ref={setNodeRef}
      style={{
        minHeight: hasChildren ? undefined : "40px",
        padding: "4px",
        background: isOver || hasChildren ? "#f5f5f5" : "transparent",
        borderRadius: "8px",
        border: isOver
          ? "2px dashed #1976d2"
          : hasChildren
          ? "1px solid #ccc"
          : "none",
        transition: "all 0.2s ease-in-out",
      }}
    >
      {children}
    </div>
  );
}

function SortableItem({ card, listIndex, updateCardData, deleteCardData }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: card.title,
      data: { listIndex },
    });

  const [openModal, setModalOpen] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: "8px",
    marginBottom: "8px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    backgroundColor: "#fff",
    cursor: "grab",
  };

  const onSave = (data) => {
    const updated = {
      title: data.title,
      description: data.description,
      date: data.date,
    };
    updateCardData(listIndex, card.title, updated);
  };
  const onDelete = (data) => {
    const updated = {
      title: data.title,
      description: data.description,
      date: data.date,
    };
    deleteCardData(listIndex, card.title, updated);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        onPointerUp={() => setModalOpen(true)}
        {...attributes}
        {...listeners}
      >
        <h4>{card.title}</h4>
      </div>
      <CardModal
        cardTitle={card.title}
        description={card.description}
        date={card.date}
        onSave={onSave}
        onDelete={onDelete}
        open={openModal}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
