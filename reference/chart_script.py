
import plotly.graph_objects as go
import numpy as np

# Data from the provided JSON
rows = ["Secure", "Preoccupied/Anxious", "Dismissive/Avoidant", "Fearful-Avoidant"]
columns = ["Secure", "Preoccupied/Anxious", "Dismissive/Avoidant", "Fearful-Avoidant"]
compatibility = [[5, 4, 4, 3], [4, 2, 1, 1], [4, 1, 2, 1], [3, 1, 1, 2]]
characteristics = [
    ["Highly Stable: Mutual trust, open communication, balanced intimacy and autonomy", 
     "Generally Good: Secure partner provides reassurance; satisfactory but may require emotional labor", 
     "Good: Secure provides safety; may struggle with intimacy needs", 
     "Moderate: Secure provides anchor; Fearful may have unpredictable needs"],
    ["Satisfactory: Secure helps ground anxious; reduced stress", 
     "High Conflict: Mutual anxiety amplifies insecurity; dependence cycle; high jealousy", 
     "Worst Match: Anxious pursues, Dismissive withdraws; pursuit-retreat cycle; high frustration", 
     "Unstable: Competing attachment needs; unpredictable conflict"],
    ["Good: Secure provides comfort; may take time to open up", 
     "Worst Match: Anxious chases, Dismissive avoids; toxic pursuit-avoidance; communication breakdown", 
     "Detached: Both maintain distance; superficial connection; low intimacy; possibly stable but emotionally distant", 
     "Poor: Both withdraw; minimal emotional connection; high conflict risk"],
    ["Moderate-Poor: Secure stabilizes; Fearful may feel unworthy", 
     "Unstable: Competing fears; alternating closeness/distance; emotional turmoil", 
     "Poor: Both fear intimacy; disconnection; minimal growth", 
     "Chaotic: Mutual fear and avoidance; intense conflicts; relationship dissolution risk"]
]

# Abbreviated labels for rows/columns (under 15 characters)
row_labels = ["Secure", "Preoccupied", "Dismissive", "Fearful"]
col_labels = ["Secure", "Preoccupied", "Dismissive", "Fearful"]

# Create short descriptive labels for each cell (under 15 chars each line)
cell_labels = [
    ["★5★<br>Highly Stable", "★4★<br>Good Match", "★4★<br>Good Match", "★3★<br>Moderate"],
    ["★4★<br>Satisfactory", "★2★<br>High Conflict", "★1★<br>Worst Match", "★1★<br>Unstable"],
    ["★4★<br>Good Match", "★1★<br>Worst Match", "★2★<br>Detached", "★1★<br>Poor"],
    ["★3★<br>Moderate-Poor", "★1★<br>Unstable", "★1★<br>Poor", "★2★<br>Chaotic"]
]

# Create hover text with full information
hover_text = []
for i in range(len(rows)):
    hover_row = []
    for j in range(len(columns)):
        text = f"<b>{rows[i]} + {columns[j]}</b><br>Compatibility: {compatibility[i][j]}/5<br><br>{characteristics[i][j]}"
        hover_row.append(text)
    hover_text.append(hover_row)

# Create the heatmap with improved color gradient
fig = go.Figure(data=go.Heatmap(
    z=compatibility,
    x=col_labels,
    y=row_labels,
    hovertext=hover_text,
    hoverinfo='text',
    colorscale=[
        [0.0, '#DB4545'],  # Red for low (1)
        [0.25, '#DB4545'], # Red
        [0.4, '#D2BA4C'],  # Yellow for moderate (2-3)
        [0.6, '#D2BA4C'],  # Yellow
        [0.75, '#2E8B57'], # Green for good (4-5)
        [1.0, '#2E8B57']   # Green
    ],
    zmin=1,
    zmax=5,
    text=cell_labels,
    texttemplate='%{text}',
    textfont={"size": 16, "color": "white"},
    showscale=True,
    colorbar=dict(
        title="Rating",
        tickmode='array',
        tickvals=[1, 2, 3, 4, 5],
        ticktext=['1 Low', '2', '3 Mod', '4', '5 High'],
        len=0.7
    )
))

fig.update_layout(
    title='Attachment Compatibility Matrix',
    xaxis_title='Partner Style',
    yaxis_title='Your Style'
)

fig.update_xaxes(side='top')
fig.update_yaxes(autorange='reversed')

# Save as PNG and SVG
fig.write_image('attachment_compatibility.png')
fig.write_image('attachment_compatibility.svg', format='svg')
