import React, { useState, useEffect } from 'react'
import { Box, Container, Typography, TextField, Button, Paper, List, ListItem, ListItemText, CircularProgress } from '@mui/material'
import { styled } from '@mui/material/styles'

declare global {
    interface Window {
        Echo: any;
    }
}

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginTop: theme.spacing(3),
}))

interface Choice {
    id: number;
    text: string;
}

interface Participant {
    id: string;
    name: string;
    choices: Choice[];
    isComplete: boolean;
}

const RaftMeeting: React.FC = () => {
    const [choices, setChoices] = useState<Choice[]>([])
    const [newChoice, setNewChoice] = useState('')
    const [participants, setParticipants] = useState<Participant[]>([])
    const [currentParticipant, setCurrentParticipant] = useState<Participant | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        // WebSocketの接続を確立
        if (window.Echo) {
            window.Echo.channel('raft-meeting')
                .listen('ChoiceAdded', (e: any) => {
                    setChoices(prev => [...prev, e.choice])
                })
                .listen('ParticipantUpdated', (e: any) => {
                    setParticipants(prev => {
                        const index = prev.findIndex(p => p.id === e.participant.id)
                        if (index === -1) {
                            return [...prev, e.participant]
                        }
                        const newParticipants = [...prev]
                        newParticipants[index] = e.participant
                        return newParticipants
                    })
                })
        }
    }, [])

    const addChoice = async () => {
        if (newChoice.trim()) {
            setIsLoading(true)
            try {
                const response = await fetch('/api/choices', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text: newChoice.trim() }),
                })
                if (response.ok) {
                    setNewChoice('')
                }
            } catch (error) {
                console.error('Error adding choice:', error)
            } finally {
                setIsLoading(false)
            }
        }
    }

    const handleChoiceSelect = async (choiceId: number) => {
        if (currentParticipant) {
            setIsLoading(true)
            try {
                const response = await fetch('/api/participants/select', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        participantId: currentParticipant.id,
                        choiceId,
                    }),
                })
                if (response.ok) {
                    const updatedParticipant = {
                        ...currentParticipant,
                        choices: [...currentParticipant.choices, { id: choiceId, text: choices.find(c => c.id === choiceId)?.text || '' }],
                        isComplete: currentParticipant.choices.length + 1 === choices.length,
                    }
                    setCurrentParticipant(updatedParticipant)
                }
            } catch (error) {
                console.error('Error selecting choice:', error)
            } finally {
                setIsLoading(false)
            }
        }
    }

    return (
        <Container maxWidth="md">
            <Typography variant="h4" component="h1" gutterBottom>
                ラフト会議
            </Typography>

            <StyledPaper>
                <Typography variant="h6" gutterBottom>
                    選択肢の追加
                </Typography>
                <Box display="flex" gap={2} mb={3}>
                    <TextField
                        fullWidth
                        label="新しい選択肢"
                        value={newChoice}
                        onChange={(e) => setNewChoice(e.target.value)}
                        disabled={isLoading}
                    />
                    <Button
                        variant="contained"
                        onClick={addChoice}
                        disabled={isLoading || !newChoice.trim()}
                    >
                        {isLoading ? <CircularProgress size={24} /> : '追加'}
                    </Button>
                </Box>

                <Typography variant="h6" gutterBottom>
                    選択肢一覧
                </Typography>
                <List>
                    {choices.map((choice) => (
                        <ListItem
                            key={choice.id}
                            sx={{
                                cursor: 'pointer',
                                opacity: isLoading || !currentParticipant || currentParticipant.choices.some(c => c.id === choice.id) ? 0.5 : 1,
                                pointerEvents: isLoading || !currentParticipant || currentParticipant.choices.some(c => c.id === choice.id) ? 'none' : 'auto',
                            }}
                            onClick={() => handleChoiceSelect(choice.id)}
                        >
                            <ListItemText primary={choice.text} />
                        </ListItem>
                    ))}
                </List>
            </StyledPaper>

            <StyledPaper>
                <Typography variant="h6" gutterBottom>
                    参加者の選択状況
                </Typography>
                <List>
                    {participants.map((participant) => (
                        <ListItem key={participant.id}>
                            <ListItemText
                                primary={participant.name}
                                secondary={participant.isComplete ? '完了' : '選択中'}
                            />
                        </ListItem>
                    ))}
                </List>
            </StyledPaper>
        </Container>
    )
}

export default RaftMeeting
