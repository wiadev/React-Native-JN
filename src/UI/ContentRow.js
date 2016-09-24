import React from 'react';
import { Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { TextBase, Base } from 'panza';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from './Colors';

const ContentRow = ({ title, titleColor, onExpand, onExpandText, borderTop, borderBottom, children, ...props }) =>
  <Base
    style={[borderTop && styles.borderTop, borderBottom && styles.borderBottom, props.style]}
    pb={2}
    {...props}
  >
    {title ?
      <Base row justify="space-between" align="center" p={2}>
        <TextBase bold color={titleColor} style={{ backgroundColor: 'transparent' }} fontSize={5}>
          {title}
        </TextBase>
        {onExpand ?
          <TouchableOpacity onPress={onExpand}>
            <Text style={styles.actionText}>
              {onExpandText} <Icon name="ios-arrow-forward" />
            </Text>
          </TouchableOpacity>
          :
          null
        }
      </Base>
      :
      null
    }
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.itemContainer}
      scrollsToTop={false}
    >
      {children}
    </ScrollView>
  </Base>
;

ContentRow.propTypes = {
  title: React.PropTypes.string,
  style: React.PropTypes.object,
  titleColor: React.PropTypes.string,
  onExpand: React.PropTypes.func,
  onExpandText: React.PropTypes.string,
  borderTop: React.PropTypes.bool,
  borderBottom: React.PropTypes.bool,
  children: React.PropTypes.node
};

ContentRow.defaultProps = {
  title: '',
  titleColor: Colors.secondary,
  onExpand: null,
  onExpandText: 'See All',
  borderTop: true,
  borderBottom: false,
};

const styles = StyleSheet.create({
  borderTop: { borderTopWidth: StyleSheet.hairlineWidth, borderColor: Colors.lightGrey },
  borderBottom: { borderBottomWidth: StyleSheet.hairlineWidth, borderColor: Colors.lightGrey },
  actionText: {
    fontSize: 15,
    color: Colors.primary
  },
  itemContainer: {
    paddingLeft: 16,
    paddingVertical: 8
  }
});


export default ContentRow;
