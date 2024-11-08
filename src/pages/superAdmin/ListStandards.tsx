import React, { useState, useEffect } from "react";
import { Checkbox, Modal, Box, IconButton } from "@mui/material";
import { PlusCircle, Trash2 } from "lucide-react";
import ListControls from "../../components/ListControls";
import CreateStandard from "./CreateStandard";
import SnackbarComponent from "../../components/SnackbarComponent";
import { getStandards, createStandard, getSections, deleteStandard } from "../../api/superAdmin";
import { Standard, Section } from "../../types/Types";

const ListStandards: React.FC = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [editingStandard, setEditingStandard] = useState<Standard | null>(null);
  const [standards, setStandards] = useState<Standard[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStandards, setSelectedStandards] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [viewMode, setViewMode] = useState<string>("list");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
    position: { vertical: "top" as const, horizontal: "center" as const },
  });

  useEffect(() => {
    fetchStandards();
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const response = await getSections();
      console.log('response:', response);

      if (response.status && response.resp_code === "SUCCESS") {
        setSections(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch sections:", err);
    }
  };

  const fetchStandards = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getStandards();

      if (response.status && response.resp_code === "SUCCESS") {
        const sortedStandards = response.data.sort((a: Standard, b: Standard) =>
          a.SequenceNumber - b.SequenceNumber
        );
        setStandards(sortedStandards);
      } else {
        throw new Error("Failed to fetch standards");
      }
    } catch (err) {
      setError("Failed to load standards. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleOpenModal = (standard: Standard | null) => {
    setEditingStandard(standard);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setEditingStandard(null);
    setOpenModal(false);
  };

  const handleSave = async (
    name: string,
    hasGroup: boolean,
    sectionId: number,
    sequenceNumber: number
  ) => {
    try {
      const response = await createStandard({
        name,
        hasGroup,
        sectionId,
        sequenceNumber
      });

      if (response.status && response.resp_code === "CREATED") {
        const newStandard: Standard = {
          ID: Date.now(),
          Name: name,
          HasGroup: hasGroup,
          SectionId: sectionId,
          SequenceNumber: sequenceNumber,
          section: sections.find(s => s.ID === sectionId)?.Name || '',
        };
        setStandards((prevStandards) => {
          const updatedStandards = [...prevStandards, newStandard];
          return updatedStandards.sort((a, b) => a.SequenceNumber - b.SequenceNumber);
        });
        setSnackbar({
          open: true,
          message: "Standard created successfully!",
          severity: "success",
          position: { vertical: "top", horizontal: "center" },
        });
      } else {
        throw new Error(response.data);
      }
    } catch (error: any) {
      console.error("Error creating standard:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.error || "Failed to create standard. Please try again.",
        severity: "error",
        position: { vertical: "top", horizontal: "center" },
      });
    }
    handleCloseModal();
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteStandard(id);
      if (response.status === true) {
        setStandards(standards.filter(standard => standard.ID !== id));
        setSelectedStandards(selectedStandards.filter(standardId => standardId !== id));
        setSnackbar({
          open: true,
          message: 'Standard deleted successfully!',
          severity: 'success',
          position: { vertical: 'top', horizontal: 'center' }
        });
      } else {
        throw new Error(response.message || 'Failed to delete standard');
      }
    } catch (error: any) {
      console.error('Error deleting standard:', error);

      if (error.response?.status === 409 && error.response?.data?.resp_code === 'RECORD_IN_USE') {
        setSnackbar({
          open: true,
          message: 'Cannot delete standard as it is being used by other records',
          severity: 'error',
          position: { vertical: 'top', horizontal: 'center' }
        });
      } else {
        setSnackbar({
          open: true,
          message: error.message || 'Failed to delete standard',
          severity: 'error',
          position: { vertical: 'top', horizontal: 'center' }
        });
      }
    }
  };

  const handleSelectAll = () => {
    setSelectedStandards(
      selectAll ? [] : standards.map((standard) => standard.ID)
    );
    setSelectAll(!selectAll);
  };

  const handleSelectStandard = (id: number) => {
    setSelectedStandards((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  const filteredStandards = standards.filter((standard) =>
    standard && standard.Name
      ? standard.Name.toLowerCase().includes(searchTerm.toLowerCase())
      : false
  );

  return (
    <div className="min-h-screen bg-gray-200 p-8 pt-5 relative">
      <ListControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        viewMode={viewMode as "list" | "grid"}
        setViewMode={setViewMode}
        itemCount={standards.length}
      />

      {loading ? (
        <div className="rounded-lg p-8 text-center">
          <p className="text-xl font-semibold">Loading standards...</p>
        </div>
      ) : error ? (
        <div className="rounded-lg p-8 text-center">
          <p className="text-xl font-semibold text-red-500">{error}</p>
        </div>
      ) : standards.length === 0 ? (
        <div className="rounded-lg p-8 text-center">
          <p className="text-xl font-semibold mb-4">No standards found.</p>
          <p className="text-gray-600">Click the "+" button to create a new standard.</p>
        </div>
      ) : filteredStandards.length === 0 ? (
        <div className="rounded-lg p-8 text-center">
          <p className="text-lg font-semibold">No standards match your search criteria.</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-300">
                <th className="text-center w-1/12">
                  <Checkbox checked={selectAll} onChange={handleSelectAll} />
                </th>
                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">
                  Sequence
                </th>
                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-4/12">
                  Standard Name
                </th>
                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">
                  Section
                </th>
                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">
                  Has Group
                </th>
                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStandards.map((standard) => (
                <tr key={standard.ID} className="cursor-pointer">
                  <td className="text-center">
                    <Checkbox
                      checked={selectedStandards.includes(standard.ID)}
                      onChange={() => handleSelectStandard(standard.ID)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="text-center">
                    <div className="text-sm font-medium text-gray-900">
                      {standard.SequenceNumber}
                    </div>
                  </td>
                  <td
                    className="text-center"
                    onClick={() => handleOpenModal(standard)}
                  >
                    <div className="text-sm font-medium text-gray-900">
                      {standard.Name}
                    </div>
                  </td>
                  <td className="text-center">
                    <div className="text-sm font-medium text-gray-900">
                      {sections?.find(s => s.ID === standard.SectionId)?.Name || ''}
                    </div>
                  </td>
                  <td className="text-center">
                    <div className="text-sm font-medium text-gray-900">
                      {standard.HasGroup ? "Yes" : "No"}
                    </div>
                  </td>
                  <td className="text-center">
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDelete(standard.ID)}
                    >
                      <Trash2 size={20} className="text-red-500" />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="fixed bottom-10 right-16 flex items-center space-x-2">
        <button
          className="bg-green-500 text-white p-2 rounded-full shadow-lg relative group hover:bg-green-600"
          onClick={() => handleOpenModal(null)}
        >
          <PlusCircle size={34} />
          <span className="absolute left-[-140px] top-1/2 transform -translate-y-1/2 bg-white text-black text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow">
            Create New Standard
          </span>
        </button>
      </div>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <CreateStandard
            initialData={editingStandard}
            onSave={handleSave}
            onCancel={handleCloseModal}
            sections={sections}
          />
        </Box>
      </Modal>

      <SnackbarComponent
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        position={snackbar.position}
        onClose={handleCloseSnackbar}
      />
    </div>
  );
};

export default ListStandards;