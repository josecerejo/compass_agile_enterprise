Ext.define('Compass.MultiCellSelectionModel', {
    
    extend: 'Ext.selection.Model',
    
    alias: 'selection.cellmodel',
    
    requires: ['Ext.util.KeyNav'],

    enableKeyNav: true,

    preventWrap: false,
    
    selected: null,

    constructor: function(){
        
        this.addEvents(
            'deselect',
            'select'
        );
        
        this.callParent(arguments);
        
    },

    bindComponent: function(view) {
        
        var me = this;
        me.primaryView = view;
        me.views = me.views || [];
        me.views.push(view);

        try{
            me.bindStore(view.getStore(), true); // extjs 4.1.x             
        }catch(e){
            me.bind(view.getStore(), true); // extjs 4.0.7
        }     

        view.on({
            cellmousedown: me.onMouseDown,
            refresh: me.onViewRefresh,
            scope: me
        });

        if (me.enableKeyNav) {
            
            me.initKeyNav(view);
            
        }
        
    },

    initKeyNav: function(view) {
        
        var me = this;

        if (!view.rendered) {
            
            view.on('render', Ext.Function.bind(me.initKeyNav, me, [view], 0), me, {single: true});
            return;
            
        }

        view.el.set({
            tabIndex: -1
        });

        me.keyNav = Ext.create('Ext.util.KeyNav', view.el, {
            up: me.onKeyUp,
            down: me.onKeyDown,
            right: me.onKeyRight,
            left: me.onKeyLeft,
            tab: me.onKeyTab,
            scope: me
        });
    },

    getHeaderCt: function() {
        
        return this.primaryView.headerCt;
        
    },
    
    allCellDeselect: function() {
        
        var me = this,
            i = 0,
            len = me.selected.items.length;

        for( ; i<len; i++){

            me.primaryView.onCellDeselect(me.selected.items[i].position);

        }
        
        me.fireEvent('deselect', me, this.selected);
        me.selected.items = [];
        
    },

    onKeyUp: function(e, t) {
        
        this.move('up', e);
        
    },

    onKeyDown: function(e, t) {
        
        this.move('down', e);
        
    },

    onKeyLeft: function(e, t) {
        
        this.move('left', e);
        
    },

    onKeyRight: function(e, t) {
        
        this.move('right', e);
        
    },

    move: function(dir, e) {

        var me = this,
            pos = me.primaryView.walkCells(me.getCurrentPosition(), dir, e, me.preventWrap),
            cell = me.view.getCellByPosition(pos);
        
        if (pos) {
            
            me.setCurrentPosition(pos);
            
        }

        cell.position = pos;
        
        if (e.ctrlKey && me.isSelected(cell)) {
            
            if(me.allowDeselect){
                
                var index = this.selected.items.indexOf(cell);
                this.selected.items.splice(index,1);
                me.primaryView.onCellDeselect(me.getCurrentPosition());
                
            }
            
        } else if (e.shiftKey && me.lastSelected) {
            
            if (me.getCurrentPosition()) {
                
                me.allCellDeselect();

            }
            
            me.selectRange(cell, false);
            
        } else if (e.ctrlKey) {
            
            me.doMultiSelect(cell, true, true);

        } else {
            
            if (me.getCurrentPosition()) {
                
                me.allCellDeselect();

            }
            
            me.doSingleSelect(cell, true);
            
        }
        
        return pos;
        
    },

    getCurrentPosition: function() {
        
        return this.position;
        
    },

    setCurrentPosition: function(pos) {
        
        var me = this;
        this.position = pos;
        
    },

    onMouseDown: function(view, cell, cellIndex, record, row, rowIndex, e) {
        
        var me = this;
        
        me.setCurrentPosition({
            row: rowIndex,
            column: cellIndex
        });
        
        me.selectWithEvent(record, e );
        
    },
    
    isSelected: function(record) {
        
        record = Ext.isNumber(record) ? this.store.getAt(record) : record;

        if(this.selected.items == null || this.selected.items == ''){
       
            return false;
            
        }
        
        return this.selected.items.indexOf(record) !== -1;
        
    },
    
    selectWithEvent: function(record, e) {
        
        var me = this;
        
        var cell = me.view.getCellByPosition(me.getCurrentPosition());
        cell.position = me.getCurrentPosition();
        
        switch (me.selectionMode) {
        
            case 'MULTI':
                
                if (e.ctrlKey && me.isSelected(cell)) {
                    
                    if(me.allowDeselect){
                        
                        var index = this.selected.items.indexOf(cell);
                        this.selected.items.splice(index,1);
                        me.primaryView.onCellDeselect(me.getCurrentPosition());
                        
                    }
                    
                } else if (e.shiftKey && me.lastSelected) {
                    
                    if (me.getCurrentPosition()) {
                        
                        me.allCellDeselect();

                    }
                    
                    me.selectRange(cell, false);
                    
                } else if (e.ctrlKey) {
                    
                    me.doMultiSelect(cell, true, true);

                } else {
                    
                    if (me.getCurrentPosition()) {
                        
                        me.allCellDeselect();

                    }
                    
                    me.doSingleSelect(cell, true);
                    
                }
                
                break;
                
            case 'SIMPLE':
                
                if (me.isSelected(record)) {
                    
                    me.doDeselect(record);
                    
                } else {
                    
                    me.doSelect(record, true);
                    
                }
                
                break;
                
            case 'SINGLE':
                
                if (me.allowDeselect && me.isSelected(record)) {
                    
                    me.doDeselect(record);
                
                } else {
                    
                    me.doSelect(record, false);
                    
                }
                
                break;
                
        }
        
    },
    
    doSingleSelect: function(record, suppressEvent) {

        var me = this,
            changed = false,
            selected = me.selected;
        
        if (me.locked) {
            
            return;
            
        }

        if (me.isSelected(record)) {
            
            return;
            
        }

        function commit () {
            me.bulkChange = true;
            if (selected.getCount() > 0 && me.doDeselect(me.lastSelected, suppressEvent) === false) {
                delete me.bulkChange;
                return false;
            }
            delete me.bulkChange;

            me.selected.items.push(record);
            me.lastSelected = record;
            changed = true;

        }

        me.onSelectChange(record, true, suppressEvent, commit);
        me.primaryView.onCellSelect(record.position);
        
        if (changed) {
            if (!suppressEvent) {
                me.setLastFocused(record);
            }
            me.maybeFireSelectionChange(!suppressEvent);
        }
        
        
    },
    
    doMultiSelect: function(records, keepExisting, suppressEvent) {
        
        var me = this,
            selected = me.selected,
            change = false,
            i = 0,
            len, record;

        if (me.locked) {
            return;
        }


        records = !Ext.isArray(records) ? [records] : records;
        len = records.length;
        if (!keepExisting && selected.getCount() > 0) {
            if (me.doDeselect(me.getSelection(), suppressEvent) === false) {
                return;
            }
        }

        function commit () {
            selected.items.push(record);
            change = true;
        }

        for (; i < len; i++) {
            
            record = records[i];
            if (keepExisting && me.isSelected(record)) {
                continue;
            }
            
            me.onSelectChange(record, true, suppressEvent, commit);
            me.primaryView.onCellSelect(record.position);
        }
        me.setLastFocused(record, suppressEvent);
        me.maybeFireSelectionChange(change && !suppressEvent);
        
    },
    
    selectRange : function(record, keepExisting){
        
        var me = this,
            start, end,
            x,y,xmin,ymin,xmax,ymax,
            records = [];
        
        if (me.isLocked()){
            return;
        }
        
        start = record.position;
        end = me.lastSelected.position

        if(start.column < end.column){
            
            xmin = start.column;
            xmax = end.column;
            
        }else{
            
            xmin = end.column;
            xmax = start.column;
            
        }
        
        if(start.row < end.row){
            
            ymin = start.row;
            ymax = end.row;
            
        }else{
            
            ymin = end.row;
            ymax = start.row;
            
        }
        
        for(x = xmin; x <= xmax; x++){
            
            for(y = ymin; y <= ymax; y++){
                
                var cell = me.view.getCellByPosition({row: y, column: x});
                cell.position = {row: y, column: x};
                me.doMultiSelect(cell, keepExisting, true);
                
            }
            
        }
        

    },
    
    onSelectChange: function(record, isSelected, suppressEvent, commitFn) {
        
        var me = this,
            view = me.view,
            eventName = isSelected ? 'select' : 'deselect';

        if ((suppressEvent || me.fireEvent('before' + eventName, me, record)) !== false &&
                commitFn() !== false) {

            if (isSelected) {
                view.onItemSelect(record);
            } else {
                view.onItemDeselect(record);
            }

            if (!suppressEvent) {
                me.fireEvent(eventName, me, record);
            }
        }
    },
    
    onKeyTab: function(e, t) {
        var me = this,
            direction = e.shiftKey ? 'left' : 'right',
            editingPlugin = me.view.editingPlugin,
            position = me.move(direction, e);

        if (editingPlugin && position && me.wasEditing) {
            editingPlugin.startEditByPosition(position);
        }
        delete me.wasEditing;
    },

    onEditorTab: function(editingPlugin, e) {
        var me = this,
            direction = e.shiftKey ? 'left' : 'right',
            position  = me.move(direction, e);

        if (position) {
            editingPlugin.startEditByPosition(position);
            me.wasEditing = true;
        }
    },

    refresh: Ext.emptyFn,

    onViewRefresh: Ext.emptyFn,

    selectByPosition: function(position) {
        this.setCurrentPosition(position);
    }
});